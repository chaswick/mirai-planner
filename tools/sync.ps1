Param(
  [switch]$VerboseCopy
)

$ErrorActionPreference = 'Stop'

function Copy-Dir($src, $dst) {
  if (-not (Test-Path $src)) { return }
  New-Item -ItemType Directory -Force -Path $dst | Out-Null
  if ($VerboseCopy) { Write-Host "Sync: $src -> $dst" }
  robocopy $src $dst /E /NFL /NDL /NJH /NJS /NP | Out-Null
}

# Paths
$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent $repoRoot
$editorSrc = Join-Path $repoRoot 'editor'
$rendererSrc = Join-Path $repoRoot 'renderer'
$schemaSrc = Join-Path $repoRoot 'schema'
$docsRoot = Join-Path $repoRoot 'docs'
$docsEditor = Join-Path $docsRoot 'editor'
$docsRenderer = Join-Path $docsRoot 'renderer'
$docsSchema = Join-Path $docsRoot 'schema'

# Ensure docs structure
New-Item -ItemType Directory -Force -Path $docsEditor | Out-Null
New-Item -ItemType Directory -Force -Path $docsRenderer | Out-Null
New-Item -ItemType Directory -Force -Path $docsSchema | Out-Null

# Copy editor (HTML/CSS/JS)
Copy-Item -Recurse -Force "$editorSrc\*" $docsEditor

# Copy renderer (HTML)
Copy-Item -Recurse -Force "$rendererSrc\*" $docsRenderer

# Copy schema
Copy-Item -Recurse -Force "$schemaSrc\*" $docsSchema

Write-Host "Sync complete: editor, renderer, schema -> docs/"

