select
        colid               = s_tcv.colid,
        name                = s_tcv.name,
        tds_collation       = s_tcv.tds_collation_100,
        "collation"         = s_tcv.collation_100
    from
        sys.spt_tablecollations_view s_tcv
    where
        s_tcv.object_id = object_id(@object, 'local')
    order by colid
