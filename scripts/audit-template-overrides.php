<?php

/**
 * @file
 * Audits Croydon Twig overrides against vendor/localgov_base copies.
 *
 * @see scripts/README.md
 */

\Drupal::service('theme.initialization')->initTheme('localgov_base_croydon');
$theme_file = DRUPAL_ROOT . '/' . \Drupal::service('extension.list.theme')->getPath('localgov_base_croydon') . '/localgov_base_croydon.theme';
require_once $theme_file;

if (!function_exists('localgov_base_croydon_audit_template_overrides')) {
  fwrite(STDERR, "Could not load localgov_base_croydon theme functions.\n");
  exit(1);
}

$rows = localgov_base_croydon_audit_template_overrides();
$problems = array_filter($rows, static fn(array $row): bool => !empty($row['vendor_wins']));

echo 'Template conflicts (custom + vendor): ' . count($rows) . PHP_EOL;
echo 'Vendor still winning: ' . count($problems) . PHP_EOL . PHP_EOL;

foreach ($rows as $row) {
  echo '=== ' . $row['filename'] . ' ===' . PHP_EOL;
  echo '  Custom:    ' . $row['custom'] . PHP_EOL;
  echo '  Vendor:    ' . $row['vendor'] . PHP_EOL;
  echo '  Identical: ' . ($row['identical'] ? 'yes' : 'NO') . PHP_EOL;
  echo '  Hook:      ' . ($row['hook'] ?? 'n/a') . PHP_EOL;
  echo '  Active:    ' . ($row['active_path'] ?? 'n/a') . PHP_EOL;
  echo '  Status:    ' . (!empty($row['vendor_wins']) ? 'PROBLEM - vendor wins' : 'OK - custom wins') . PHP_EOL;
  echo PHP_EOL;
}

exit(0);
