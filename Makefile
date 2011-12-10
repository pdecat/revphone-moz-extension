target/revphone.xpi: target src/* src/content/*
	cd src && zip --recurse-paths ../target/revphone.xpi . --exclude=.svn/* --exclude=**/.svn/*

target:
	mkdir target
clean:
	rm -f target/revphone.xpi
