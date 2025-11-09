# ldap/Dockerfile
FROM osixia/openldap:1.5.0

# Salin file LDIF kita ke lokasi yang benar di dalam image
COPY users.ldif /container/service/slapd/assets/config/bootstrap/ldif/50-users.ldif