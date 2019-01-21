Frikanalen
==========

Tools and web for the Norwegian public access TV channel [Frikanalen](https://frikanalen.no/).

[GitHub page](http://github.com/Frikanalen/) | [Project mailing list](http://lists.nuug.no/mailman/listinfo/frikanalen/)

This is a repo with several different projects in it. You'll find them in [/packages](packages/):

- [fkweb](packages/fkweb) - This is the website, and the API.
- [fkupload](packages/fkupload) - Upload backend (the frontend is in fkweb) taking files from users
- [fkprocess](packages/fkprocess) - The processing backend for the files
- [utils](packages/utils) - Small utilities and helpers, and things we find no other place for

Of note is also [our infrastructure Ansible setup](infra/).

Some folders have a basic README-file explaining what it is.

Running all tests
-----------------
You might need to install `sqlite3`, `python3` and `ffmpeg`.

Install the Python requirements:

    make env # sets up the python virtual env
    make requirements

Run the tests:

    make test

A small peak at our [Travis config file](.travis.yml) might help you as well.

License
-------
All under the GNU LGPL license, see the file [COPYING](COPYING) for more details.
