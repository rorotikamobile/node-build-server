sudo zypper addrepo http://download.opensuse.org/repositories/devel:/languages:/perl/SLE_11_SP3/devel:languages:perl.repo
sudo zypper update
sudo zypper addrepo http://download.opensuse.org/repositories/devel:/tools:/scm/SLE_11_SP2/devel:tools:scm.repo
sudo zypper install git-core

Macros:

%build_node()  \
        curl http://beta.rorotika:5067/build/%1 > node-app-build.tgz \
        if [ $? -ne 0 ]; then \
                echo "Error building node app!"; \
                exit 255 \
        fi \
        tar xzvf node-app-build.tgz \
        rm node-app-build.tgz


%install_node() \
        mkdir -p %{buildroot}/opt/rorotika/home/apps/%1-%{version} \
        cp -r %{_builddir}/* %{buildroot}/opt/rorotika/home/apps/%1-%{version} \
        echo >> %{buildroot}/opt/rorotika/home/config/spec/%1 \

