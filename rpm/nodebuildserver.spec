%define artifactId nodebuildserver

Summary: NodeBuildServer
Name: rorotika-%{artifactId}
Version: %{artifactVersion}
Release: 1
License: Rorotika License
Group: Applications/Communications
BuildRoot: /var/tmp/%{name}-buildroot
Requires: digitata-application-manager
Requires(post): digitata-application-manager
Requires(postun): digitata-application-manager
%description
The NodeBuildServer RPM.

%prep

%build
%build_node %{artifactId}

%install
%install_clean
%install_config
%install_node %{artifactId}

%clean
rm -rf %{buildroot}

%post
%start_app %artifactId %artifactVersion
%install_snapshot_local
%not_on_upgrade

%postun
%not_on_upgrade_uninstall
%stop_app %artifactId %artifactVersion
%uninstall_snapshot_local

%files
%defattr(644,rorotika,users,755)
%roro_files

%changelog
