#!/usr/bin/env bash

#Edit here:
OLD_DB_URL=db.maqzwrhxxdfqoyudetmn.supabase.co
NEW_DB_URL=db.iamqzppnbsfqxaxfjeje.supabase.co
OLD_DB_PASS=zimZyx-sudguv-dasbe8
NEW_DB_PASS=dutbov-bYtziv-2pocpy

#Script:
# Default case for Linux sed, just use "-i"
sedi=(-i)
case "$(uname)" in
  # For macOS, use two parameters
  Darwin*) sedi=(-i "")
esac

pg_dump postgres://postgres:"$OLD_DB_PASS"@"$OLD_DB_URL":5432/postgres \
  --clean \
  --if-exists \
  --schema-only \
  --quote-all-identifiers \
  --exclude-table-data 'storage.objects' \
  --exclude-schema 'extensions|graphql|graphql_public|net|tiger|pgbouncer|vault|realtime|supabase_functions|storage|pg*|information_schema' \
  --schema '*' > dump.sql 

sed "${sedi[@]}" -e 's/^DROP SCHEMA IF EXISTS "auth";$/-- DROP SCHEMA IF EXISTS "auth";/' dump.sql
sed "${sedi[@]}" -e's/^DROP SCHEMA IF EXISTS "storage";$/-- DROP SCHEMA IF EXISTS "storage";/' dump.sql
sed "${sedi[@]}" -e 's/^CREATE SCHEMA "auth";$/-- CREATE SCHEMA "auth";/' dump.sql
sed "${sedi[@]}" -e 's/^CREATE SCHEMA "storage";$/-- CREATE SCHEMA "storage";/' dump.sql
sed "${sedi[@]}" -e 's/^ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin"/-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin"/' dump.sql
psql postgres://postgres:"$NEW_DB_PASS"@"$NEW_DB_URL":5432/postgres --file dump.sql