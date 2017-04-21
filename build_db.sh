sudo -u postgres psql postgres -f setup.schema

expect <<- DONE
	set timeout -1
	spawn psql -U accounting -h 127.0.0.1 -f pschema.schema enterprise
	expect "*accounting:*"
	send -- "Lpb3LMDMfaBd63bY3NayRA8ukVWscx\r"
	send -- "\r"
	expect eof
DONE

echo "done"


