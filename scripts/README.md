# Theme scripts

Utility scripts for maintaining `localgov_base_croydon`.

## Template override audit

This sub-theme ships a copy of `localgov_base` under `vendor/localgovdrupal/localgov_base/`. Drupal discovers Twig templates in both `templates/` and `vendor/`, and the vendor copy can win when both define the same filename.

`hook_theme_registry_alter()` in `localgov_base_croydon.theme` ensures any matching file in `templates/` takes precedence over the vendor copy.

After updating this theme (or if layout/markup looks wrong), run the audit script from the **project root** to check that Croydon overrides are active.

### Usage

```bash
drush php:script web/themes/contrib/localgov_base_croydon/scripts/audit-template-overrides.php
```

If you use Docker locally:

```bash
docker compose exec --user www-data apache-php ./bin/drush php:script web/themes/contrib/localgov_base_croydon/scripts/audit-template-overrides.php
```

### Output

The script lists templates that exist in both `templates/` and `vendor/localgovdrupal/localgov_base/templates/`, and reports which path Drupal is using.

Look for:

- **OK - custom wins** — the Croydon override is active
- **PROBLEM - vendor wins** — the vendor copy is still in use; check `hook_theme_registry_alter()` and rebuild caches with `drush cr`

### When to run

Re-run the audit after:

- `composer update` or any change that touches `vendor/localgovdrupal/localgov_base/`
- Layout or markup regressions following a theme upgrade
- Adding or changing Twig overrides in `templates/`
