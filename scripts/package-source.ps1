$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$stageRoot = Join-Path ([IO.Path]::GetTempPath()) ('hurteemj-source-' + [guid]::NewGuid().ToString('N'))
$archiveDirectory = Join-Path $projectRoot 'artifacts'
$archivePath = Join-Path $archiveDirectory 'hurteemj-source.zip'
# Deliberately list source/configuration entries instead of archiving the workspace.
$entries = @('src','db','scripts','.github','.env.example','.gitignore','.node-version',
  'package.json','package-lock.json','tsconfig.json','next-env.d.ts','next.config.ts',
  'postcss.config.mjs','eslint.config.mjs','neon.ts','render.yaml','README.md','HOME_POSTS.md','review-flags.txt',
  'HELP_REVIEW.md','RIGHTS_REVIEW.md','UNDERSTAND_REVIEW.md','PUBLIC_REVIEW.md','HOME_ONLY_POSTS.md')
New-Item -ItemType Directory -Path $stageRoot | Out-Null
try {
  foreach ($entry in $entries) {
    $sourcePath = Join-Path $projectRoot $entry
    if (-not (Test-Path -LiteralPath $sourcePath)) { continue }
    $item = Get-Item -LiteralPath $sourcePath -Force
    $items = @($item)
    if ($item.PSIsContainer) { $items += @(Get-ChildItem -LiteralPath $sourcePath -Recurse -Force) }
    foreach ($candidate in $items) {
      if ($candidate.Attributes -band [IO.FileAttributes]::ReparsePoint) { throw 'Source export refuses symbolic links and redirected directories.' }
      if ($candidate.Name -eq '.neon' -or ($candidate.Name -like '.env*' -and $candidate.FullName -ne (Join-Path $projectRoot '.env.example'))) { throw 'Source export found a private environment file in a source directory.' }
    }
    Copy-Item -LiteralPath $sourcePath -Destination (Join-Path $stageRoot $entry) -Recurse -Force
  }
  foreach ($required in @('db/004-home-posts.sql','scripts/migrate.mjs','scripts/grant-admin.mjs','package-lock.json','.env.example')) {
    if (-not (Test-Path -LiteralPath (Join-Path $stageRoot $required))) { throw "Required setup file missing: $required" }
  }
  New-Item -ItemType Directory -Path $archiveDirectory -Force | Out-Null
  # Write outside the staged tree so the archive cannot include itself.
  $temporaryArchive = $stageRoot + '.zip'
  [IO.Compression.ZipFile]::CreateFromDirectory($stageRoot,$temporaryArchive,[IO.Compression.CompressionLevel]::Optimal,$false)
  Move-Item -LiteralPath $temporaryArchive -Destination $archivePath -Force
  Write-Output "Source archive created: $archivePath"
  Write-Output 'Includes db/ and scripts/. Excludes .env, .neon, .git, node_modules and .next.'
} finally {
  $resolvedStage = [IO.Path]::GetFullPath($stageRoot)
  $temporaryRoot = [IO.Path]::GetFullPath([IO.Path]::GetTempPath())
  if (-not $resolvedStage.StartsWith($temporaryRoot,[StringComparison]::OrdinalIgnoreCase) -or -not ([IO.Path]::GetFileName($resolvedStage)).StartsWith('hurteemj-source-')) { throw 'Unexpected staging directory; cleanup refused.' }
  if (Test-Path -LiteralPath $resolvedStage) { Remove-Item -LiteralPath $resolvedStage -Recurse -Force }
}
