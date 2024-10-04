import * as sax from "./saxfactory";
import { StringBuilder } from "../common/stringBuilder";
import { DataInfo } from "./dataInfo";
import { ScalarType } from "./saxfactory";
import { PlanNode } from "./model";


const OPEN_PAR = "(";
const CLOSE_PAR = ")";
const COMMA = ",";
const DISTINCT = "DISTINCT";
const IF = "IF";
const THEN = "THEN";
const ELSE = "ELSE";
const NOT = "NOT";
const SYM_EQ = "=";
const SEMICOLON = ";\n";
const CONVERT_IMPLICIT = "CONVERT_IMPLICIT";
const CONVERT = "CONVERT";

export function formatScalar(node: PlanNode | DataInfo, scalar: ScalarType, postFormat?: (value: string) => string) {
    const di = (node instanceof PlanNode) ? node.dataInfo : node;
    const fc = new FormatterContext(di).appendScalar(scalar);
    return () => {
        if (postFormat) {
            return postFormat(fc.format());
        }
        return fc.format();
    };
}


class FormatterContext {

    builder: StringBuilder = new StringBuilder();

    constructor(public dataInfo: DataInfo) {

    }

    format() {
        return this.builder.format(" ");
    }

    append(token: any, inParentheses?: boolean) {
        if (inParentheses) {
            this.builder.append(OPEN_PAR);
            this.builder.append(token);
            this.builder.append(CLOSE_PAR);
        } else {
            this.builder.append(token);
        }
    }

    appendColumn(token?: sax.ColumnReferenceType) {
        if (token) {

            this.dataInfo.addColumns("scalar_item", [token]);
            this.builder.append(() => {
                return this.dataInfo.getColumn(token).displayName;
            });
        }
    }

    appendObject(token?: sax.ObjectType): any {

        if (token) {
            const table = this.dataInfo.getTable(token);
            if (table) {
                this.builder.append(() => {
                    return table.displayName;
                });
            }
        }

        throw new Error("Method not implemented.");
    }

    appendScalar(token?: sax.ScalarType, inParentheses?: boolean) {
        if (token) {
            if (inParentheses) {
                this.builder.append(OPEN_PAR);
                formatScalarType(this, token);
                this.builder.append(CLOSE_PAR);
            } else {
                formatScalarType(this, token);
            }
        }
        return this;
    }

    appendScalarList(token?: sax.ScalarType[]) {
        if (token && token.length > 0) {
            if (token.length === 1) {
                this.appendScalar(token[0], true);
            } else {
                this.append(OPEN_PAR);
                this.appendScalar(token[0], true);
                let i = 1;
                while (i < token.length) {
                    this.append(COMMA);
                    this.appendScalar(token[i], true);
                    i++;
                }
                this.append(CLOSE_PAR);
            }
        }
        return this;
    }
}

function formatScalarType(context: FormatterContext, item?: sax.ScalarType) {
    if (!item) return false;
    if (formatAggregateType(context, item.Aggregate)) return true;
    if (formatArithmeticType(context, item.Arithmetic)) return true;
    if (formatAssignType(context, item.Assign)) return true;
    if (formatCompareType(context, item.Compare)) return true;
    if (formatConstType(context, item.Const)) return true;
    if (formatConvertType(context, item.Convert)) return true;
    if (formatIdentType(context, item.Identifier)) return true;
    if (formatConditionalType(context, item.IF)) return true;
    if (formatIntrinsicType(context, item.Intrinsic)) return true;
    if (formatLogicalType(context, item.Logical)) return true;
    if (formatMultAssignType(context, item.MultipleAssign)) return true;
    if (formatScalarExpressionListType(context, item.ScalarExpressionList)) return true;
    if (formatScalarSequenceType(context, item.Sequence, )) return true;
    if (formatSubqueryType(context, item.Subquery)) return true;
    if (formatUDTMethodType(context, item.UDTMethod)) return true;
    if (formatUDAggregateType(context, item.UserDefinedAggregate)) return true;
    if (formatUDFType(context, item.UserDefinedFunction)) return true;
    return false;
}
function formatAggregateType(context: FormatterContext, item?: sax.AggregateType) {
    if (!item) return false;
    if (item.AggType) context.append(item.AggType.toUpperCase());
    if (item.Distinct) context.append(DISTINCT);
    context.appendScalarList(item.ScalarOperator);
    return true;
}
function formatArithmeticType(context: FormatterContext, item?: sax.ArithmeticType) {
    if (!item) return false;
    switch (item.ScalarOperator.length) {
        case 0:
            return false;
        case 1:
            context.append(formatArithmeticOperation(item.Operation));
            context.appendScalar(item.ScalarOperator[0]);
            return true;
        default:
            context.appendScalar(item.ScalarOperator[0]);
            context.append(formatArithmeticOperation(item.Operation));
            context.appendScalar(item.ScalarOperator[1]);
            return true;
    }
}
function formatAssignType(context: FormatterContext, item?: sax.AssignType) {
    if (!item) return false;

    context.appendColumn(item.ColumnReference);
    context.append(SYM_EQ);
    context.appendScalar(item.ScalarOperator);
    return true;
}
function formatCompareType(context: FormatterContext, item?: sax.CompareType) {
    if (!item) return false;
    switch (item.ScalarOperator.length) {
        case 0:
            return false;
        case 1:
            context.append(formatCompareOp(item.CompareOp));
            context.appendScalar(item.ScalarOperator[0]);
            return true;
        default:
            context.appendScalar(item.ScalarOperator[0]);
            context.append(formatCompareOp(item.CompareOp));
            context.appendScalar(item.ScalarOperator[1]);
            return true;
    }
}
function formatConstType(context: FormatterContext, item?: sax.ConstType) {
    if (!item) return false;
    context.append(item.ConstValue);
    return true;
}
function formatConvertType(context: FormatterContext, item?: sax.ConvertType) {
    if (!item) return false;
    if (!item.DataType) return false;
    if (!item.ScalarOperator) return false;

    context.append(((item.Implicit) ? CONVERT_IMPLICIT : CONVERT) + OPEN_PAR);

    const typeBuilder: StringBuilder = new StringBuilder();
    typeBuilder.append(item.DataType);
    if (item.Length !== undefined) {
        typeBuilder.append(OPEN_PAR);
        typeBuilder.append(item.Length);
        typeBuilder.append(CLOSE_PAR);
    } else if (item.Precision !== undefined) {
        typeBuilder.append(OPEN_PAR);
        typeBuilder.append(item.Precision);
        if (item.Scale !== undefined) {
            typeBuilder.append(COMMA);
            typeBuilder.append(item.Scale);
        }
        typeBuilder.append(CLOSE_PAR);
    }
    typeBuilder.append(COMMA);
    context.append(typeBuilder.format(""));

    context.appendScalar(item.ScalarOperator);
    context.append(COMMA);

    if (item.StyleIndex !== undefined) {
        context.append(item.StyleIndex);
    }
    else if (item.Style !== undefined) {
        context.appendScalar(item.Style.ScalarOperator);
    } else {
        context.append("0");
    }

    context.append(CLOSE_PAR);

    return true;
}
function formatIdentType(context: FormatterContext, item?: sax.IdentType) {
    if (!item) return false;
    if (item.Table) {
        context.append(item.Table);
    }
    else if (item.ColumnReference) {
        context.appendColumn(item.ColumnReference);
    } else {
        return false;
    }
    return true;
}
function formatConditionalType(context: FormatterContext, item?: sax.ConditionalType) {
    if (!item) return false;
    if (item.Condition && item.Condition.ScalarOperator && item.Then && item.Then.ScalarOperator) {
        context.append(IF);
        context.appendScalar(item.Condition.ScalarOperator, true);
        context.append(THEN);
        context.appendScalar(item.Then.ScalarOperator, true);
        if (item.Else && item.Else.ScalarOperator) {
            context.append(ELSE);
            context.appendScalar(item.Else.ScalarOperator, true);
        }
    }
    return true;
}
function formatIntrinsicType(context: FormatterContext, item?: sax.IntrinsicType) {
    if (!item) return false;

    if (item.FunctionName) {
        context.append(item.FunctionName);
        context.appendScalarList(item.ScalarOperator);
    }

    return true;
}
function formatLogicalType(context: FormatterContext, item?: sax.LogicalType) {
    if (!item) return false;
    if (!item.Operation) return false;
    if (item.ScalarOperator.length === 0) return false;

    if (item.Operation === NOT) {
        context.append(item.Operation);
        context.appendScalarList(item.ScalarOperator);
    } else {
        context.appendScalar(item.ScalarOperator[0], true);
        context.append(item.Operation);
        if (item.ScalarOperator.length > 1) {
            const sc: sax.ScalarType[] = [];
            for (let i = 1; i < item.ScalarOperator.length; i++) {
                sc.push(item.ScalarOperator[i]);
            }
            context.appendScalarList(sc);
        } else {
            context.appendScalar(item.ScalarOperator[1], true);
        }
    }

    return true;
}
function formatMultAssignType(context: FormatterContext, item?: sax.MultAssignType) {
    if (!item) return false;

    for (const at of item) {
        formatAssignType(context, at);
        context.append(SEMICOLON);
    }

    return true;
}
function formatScalarExpressionListType(context: FormatterContext, item?: sax.ScalarExpressionListType) {
    if (!item) return false;
    context.appendScalarList(item);
    return true;
}
function formatScalarSequenceType(context: FormatterContext, item?: sax.ScalarSequenceType) {
    if (!item) return false;
    if (!item.FunctionName) return false;
    context.append(item.FunctionName);
    return true;
}
function formatSubqueryType(context: FormatterContext, item?: sax.SubqueryType) {
    if (!item) return false;

    context.appendScalar(item.ScalarOperator, true);
    if (item.Operation) {
        context.append(item.Operation);
    }
    if (item.RelOp) {
        context.append("<subquery>");
    }

    return true;
}
function formatUDTMethodType(context: FormatterContext, item?: sax.UDTMethodType) {
    if (!item) return false;
    if (item.CLRFunction) {
        const parts: string[] = [];
        if (item.CLRFunction.Assembly) {
            parts.push(item.CLRFunction.Assembly);
        }
        if (item.CLRFunction.Class) {
            parts.push(item.CLRFunction.Class);
        }
        if (item.CLRFunction.Method) {
            parts.push(item.CLRFunction.Method);
        }
        context.append(parts.join("."));
    }
    context.appendScalarList(item.ScalarOperator);
    return true;

}
function formatUDAggregateType(context: FormatterContext, item?: sax.UDAggregateType) {
    if (!item) return false;
    if (item.Distinct) {
        context.append(DISTINCT);
    }
    context.appendObject(item.UDAggObject);
    context.appendScalarList(item.ScalarOperator);
    return true;
}
function formatUDFType(context: FormatterContext, item?: sax.UDFType) {
    if (!item) return false;
    if (item.IsClrFunction && item.CLRFunction) {
        const parts: string[] = [];
        if (item.CLRFunction.Assembly) {
            parts.push(item.CLRFunction.Assembly);
        }
        if (item.CLRFunction.Class) {
            parts.push(item.CLRFunction.Class);
        }
        if (item.CLRFunction.Method) {
            parts.push(item.CLRFunction.Method);
        }
        context.append(parts.join("."));
    } else {
        context.append(item.FunctionName);
    }
    context.appendScalarList(item.ScalarOperator);
    return true;

}

export function formatCompareOp(op: string): string {
    const val = compareOpTypeMap[op];
    return (val === undefined) ? op : val;
}
const compareOpTypeMap: { [name: string]: string } = {
    "EQ": "=",
    "GE": ">=",
    "GT": ">",
    "LE": "<=",
    "LT": "<",
    "NE": "<>"
};


function formatArithmeticOperation(op: string): string {
    const val = arithmeticOperationTypeMap[op];
    return (val === undefined) ? op : val;
}
const arithmeticOperationTypeMap: { [name: string]: string } = {

    "ADD": "+",
    "BIT_ADD": "BIT ADD",
    "BIT_AND": "&",
    "BIT_COMBINE": "BIT COMBINE",
    "BIT_NOT": "~",
    "BIT_OR": "|",
    "BIT_XOR": "^",
    "DIV": "/",
    "MINUS": "-",
    "MOD": "%",
    "MULT": "*",
    "SUB": "-"
};



