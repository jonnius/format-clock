
gsettingsschemadir=${extensiondir}/schemas

gsettings_SCHEMAS = org.gnome.shell.extensions.format-clock.gschema.xml

@GSETTINGS_RULES@

gschemas.compiled: $(gsettings_SCHEMAS:.xml=.valid)
	$(AM_V_GEN) $(GLIB_COMPILE_SCHEMAS) --targetdir=. .

all-local: gschemas.compiled
EXTRA_DIST = $(gsettings_SCHEMAS)
