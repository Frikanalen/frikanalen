Frikanalen Beta
===============

Tools and web for the Norwegian public access TV channel [Frikanalen](http://www.frikanalen.no/).

The latest version of the source is available from [our GitHub page](http://github.com/Frikanalen/).

This is all under the GNU LGPL license, see the file COPYING for more details.

Read `INSTALL.md` to get started with development.

Please report bugs as issues at github and submit patches as pull requests there.

The project mailing list is available from <http://lists.nuug.no/mailman/listinfo/frikanalen/>.

Deploying
---------
The new way to deploy is a githook. Set up the remotes:

    git remote add prod fkweb@frikanalen-prod.nuug.no:git/
    git remote add dev fkweb@frikanalen-dev.nuug.no:git/

Now you can easily push your changes:

    git push dev master:master

For more advanced things you'd want to check [our infrastructure Ansible setup](infra/).
