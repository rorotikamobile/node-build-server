##node build sever
-----------------

An http server to use to "build" (npm install) a nodejs project for a different OS. Because some NPM modules
use native bindings and are thus dependant on system specific libraries in some cases, we needed a "cross-building"
solution. Well, the simplest seemed to be to run an http server on the specific architecture we need, and then
use an http verb to "build" the source.

###Usage
--------

Install on system of choice. Make sure git and an .ssh key is setup correctly, then simply:

    curl http://<server>5067/<project_name>

And you will receive a tarball containg the project, installed with npm install and so forth.


###SLES RPMs
------------

    sudo zypper addrepo http://download.opensuse.org/repositories/devel:/languages:/perl/SLE_11_SP3/devel:languages:perl.repo
    sudo zypper update
    sudo zypper addrepo http://download.opensuse.org/repositories/devel:/tools:/scm/SLE_11_SP2/devel:tools:scm.repo
    sudo zypper install git-core

###RPM Macros
-------------

    %build_node()  \
        curl http://<host>:5067/build/%1 > node-app-build.tgz \
        if [ $? -ne 0 ]; then \
                echo "Error building node app!"; \
                exit 255 \
        fi \
        tar xzvf node-app-build.tgz \
        rm node-app-build.tgz


    %install_node() \
        mkdir -p %{buildroot}/YOURDIR/%1-%{version} \
        cp -r %{_builddir}/* %{buildroot}/YOURDIR/%1-%{version} \

