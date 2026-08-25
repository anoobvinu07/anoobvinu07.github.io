---
title: "Github actions"
description: "Quick reference cheatsheet for frequently used bash commands and SLURM commands to submit or manage jobs on a HPC"
author:
  - name: "Anoob Prakash"
#    email: "your.email@example.edu"
#    orcid: "0000-0000-0000-0000"
date: "2026-08-09"
listed: false
categories:
  - HPC
  - Bash
  - Slurm
image: "/notebook/posts/cluster-cheatsheet/cheatsheet.png"
format:
  html:
    toc: true
    toc-location: left
    code-fold: false
    code-overflow: wrap
---



<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# the sites are already rendered before they are pushed to anoobvinu07 and they are deployed with github pages, main and published in /docs . this published website should also be hosted at anoobprakash

Yes—then you do **not** need Quarto rendering in GitHub Actions. Your workflow should simply mirror the already rendered `docs/` directory from the `anoobvinu07` repository into the `docs/` directory of the `anoobprakash.github.io` repository.

GitHub Pages supports serving a site from `main` → `/docs`, and will republish when that folder changes.[^1][^2]

## Desired setup

```text
anoobvinu07/anoobvinu07.github.io
├── source .qmd files
├── _quarto.yml
└── docs/                   ← already-rendered site, committed locally
    ├── index.html
    ├── assets/
    └── ...

             push to main
                   ↓
            GitHub Action
                   ↓
anoobprakash/anoobprakash.github.io
└── docs/                   ← identical copy of source docs/
    ├── index.html
    ├── assets/
    └── ...
```

Your existing source site continues at:

- `https://anoobvinu07.github.io/`

The mirrored Pages site is served at:

- `https://anoobprakash.github.io/`


## Target repository setup

In `anoobprakash/anoobprakash.github.io`:

1. Create the repository if it does not exist.
2. Ensure its default branch is `main`.
3. Go to **Settings → Pages**.
4. Set:
    - **Source:** Deploy from a branch
    - **Branch:** `main`
    - **Folder:** `/docs`
5. Save.

Pages requires an entry file such as `index.html` at the top level of the selected publishing folder—here, `docs/index.html`.[^3]

## Create cross-account token

Because the action runs in `anoobvinu07/anoobvinu07.github.io` but needs to commit to a different repository/account, create a fine-grained personal access token from the `anoobprakash` GitHub account:

- **Repository access:** Only select `anoobprakash/anoobprakash.github.io`
- **Repository permissions:** `Contents: Read and write`

Then, in the **source** repository (`anoobvinu07/anoobvinu07.github.io`):

1. Go to **Settings → Secrets and variables → Actions**
2. Create a repository secret named `ANOO_B_PAGES_TOKEN`
3. Paste the token.

The workflow’s built-in `GITHUB_TOKEN` is normally limited to the repository containing the workflow, so it is not suitable for pushing to the other repository.[^4][^5]

## Mirror workflow

Create this file in the source repository:

`.github/workflows/mirror-anoobprakash-pages.yml`

```yaml
name: Mirror rendered site to anoobprakash.github.io

on:
  push:
    branches:
      - main
    paths:
      - "docs/**"
  workflow_dispatch:

jobs:
  mirror-site:
    runs-on: ubuntu-latest

    steps:
      - name: Check out source repository
        uses: actions/checkout@v4

      - name: Check out destination repository
        uses: actions/checkout@v4
        with:
          repository: anoobprakash/anoobprakash.github.io
          token: ${{ secrets.ANOO_B_PAGES_TOKEN }}
          path: destination

      - name: Copy rendered docs site
        run: |
          mkdir -p destination/docs
          rsync -av --delete \
            --exclude=".git" \
            docs/ destination/docs/

      - name: Commit and push changes
        working-directory: destination
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

          git add docs/

          if git diff --cached --quiet; then
            echo "No mirrored site changes to commit."
          else
            git commit -m "Mirror website from anoobvinu07"
            git push origin main
          fi
```


## Important details

- `paths: ["docs/**"]` means the workflow runs only when your rendered website changes, not every time you edit source `.qmd` files without rendering.
- `rsync --delete` makes the target `docs/` an exact mirror. For example, deleting a post or image from the source `docs/` also deletes it from the target site.
- The target repository may contain other files—such as a `README.md` or `.github/` workflows—because the workflow modifies only `destination/docs/`.
- Add a `docs/.nojekyll` file to the source repository if it does not already exist. This prevents GitHub Pages from applying Jekyll processing to your already-built Quarto static files. GitHub notes that this is useful for sites built with static site generators other than Jekyll.[^3]

```bash
touch docs/.nojekyll
git add docs/.nojekyll
git commit -m "Disable Jekyll processing for Pages"
git push
```

After you render locally and push the updated `docs/` folder to `main`, the action will update `anoobprakash/anoobprakash.github.io/docs/`, and GitHub Pages will redeploy that mirrored version automatically.
<span style="display:none">[^10][^11][^12][^13][^14][^15][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

[^2]: https://quarto.org/docs/publishing/github-pages.html

[^3]: https://docs.github.com/articles/creating-project-pages-manually

[^4]: https://docs.github.com/actions/reference/authentication-in-a-workflow

[^5]: https://github.com/orgs/community/discussions/168256

[^6]: https://stackoverflow.com/questions/77726552/how-to-deploy-a-website-with-github-pages-from-a-folder-other-than-docs

[^7]: https://github.blog/changelog/2021-04-20-github-actions-control-permissions-for-github_token/

[^8]: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository

[^9]: https://github.com/orgs/community/discussions/138818

[^10]: https://github.com/orgs/community/discussions/23073

[^11]: https://github.com/orgs/community/discussions/160560

[^12]: https://www.youtube.com/watch?v=prkKFRiSZx0

[^13]: https://www.stepsecurity.io/blog/github-token-how-it-works-and-how-to-secure-automatic-github-action-tokens

[^14]: https://discourse.gohugo.io/t/simple-deployment-to-gh-pages/5003

[^15]: https://some-natalie.dev/blog/multi-repo-actions/

