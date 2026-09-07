# Website preview and publishing

Repository: https://github.com/Lasermorphweb/Lasermorph

GitHub Pages publishes the repository root on the `main` branch automatically.

Share these stable links with collaborators:

- Website: https://lasermorphweb.github.io/Lasermorph/
- Design Tool: https://lasermorphweb.github.io/Lasermorph/pages/subpage/designTool.html
- Laser Calibration: https://lasermorphweb.github.io/Lasermorph/pages/subpage/laserCalibration.html

## Preview locally

In a PowerShell terminal:

```powershell
Set-Location D:\LaserMorph
python -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000/ or http://127.0.0.1:8000/pages/subpage/laserCalibration.html.
Keep the terminal running while previewing; press Ctrl+C to stop it.
The local address is only accessible on your computer. Local edits become
visible after refreshing the browser, but are not published until pushed.

## Publish reviewed changes

Check remote changes before editing:

```powershell
git status
git pull --ff-only origin main
```

After checking the local preview, inspect the changes and stage the specific
website files you intend to publish. For example:

```powershell
git diff
git add pages/subpage/laserCalibration.html pages/subpage/designTool.html pages/subpage/MFGuide.html
git diff --cached --stat
git commit -m "Update laser calibration website"
git push origin main
```

Keep review inputs in `revision-feedback/` local unless you intend to publish
them in this public repository. Avoid staging unrelated files with `git add .`.

After pushing, check the deployment:

```powershell
gh api repos/Lasermorphweb/Lasermorph/pages/builds/latest --jq '{status,commit,error}'
```

Wait for `status` to become `built` and confirm that `commit` matches
`git rev-parse HEAD`. Then open the shared link to verify the published page.
If the browser still shows an older page, refresh with Ctrl+F5.
Pushing does not make the site update instantly; GitHub must finish its build
and deployment first. The shared URLs stay the same across updates.
