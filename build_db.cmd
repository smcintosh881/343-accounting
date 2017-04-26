psql -U postgres -f setup.schema
set PGPASSWORD=Lpb3LMDMfaBd63bY3NayRA8ukVWscx
psql -U accounting -h 127.0.0.1 -f pschema.schema enterprise
set PGPASSWORD=