"use strict";

const updateReleaseUrl = "https://github.com/microbica/WowBrowser-Releases/releases/latest";
const updateLinks = {
  release: document.querySelector("#update-release-link"),
  installer: document.querySelector("#update-installer-link"),
  portable: document.querySelector("#update-portable-link")
};
const fallbackLinks = {
  release: updateReleaseUrl,
  installer: updateReleaseUrl + "/download/WowBrowser-win-Setup.exe",
  portable: updateReleaseUrl + "/download/WowBrowser-win-Portable.zip"
};

function safeHttpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

async function loadUpdateManifest() {
  try {
    const response = await fetch("version.json", { cache: "no-store", credentials: "omit" });
    if (!response.ok) return;
    const manifest = await response.json();
    if (!manifest || manifest.schemaVersion !== 1 || typeof manifest.version !== "string") return;
    if (!/^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:\.(0|[1-9]\d*))?(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/.test(manifest.version.trim()))
      return;
    document.querySelector("#update-available-version").textContent = manifest.version.trim();
    const windows = manifest.downloads?.windows;
    updateLinks.release.href = safeHttpsUrl(manifest.releaseUrl) || fallbackLinks.release;
    updateLinks.installer.href = safeHttpsUrl(windows?.installer) || fallbackLinks.installer;
    updateLinks.portable.href = safeHttpsUrl(windows?.portable) || fallbackLinks.portable;
  } catch {
    // Los enlaces de respaldo siguen disponibles si no se puede leer el manifiesto.
  }
}

document.addEventListener("click", (event) => {
  const download = event.target.closest("[data-download]");
  if (download) {
    const url = safeHttpsUrl(download.href);
    if (!url) {
      event.preventDefault();
      return;
    }
    if (window.__wowbrowser?.native === true) {
      event.preventDefault();
      window.location.href = "wowbrowser://open-external?url=" + encodeURIComponent(url);
    }
    return;
  }

  const link = event.target.closest("[data-open-external]");
  if (!link) return;
  const url = safeHttpsUrl(link.href);
  if (!url) {
    event.preventDefault();
    return;
  }
  if (window.__wowbrowser?.native === true) {
    event.preventDefault();
    window.location.href = "wowbrowser://open-external?url=" + encodeURIComponent(url);
  }
});

void loadUpdateManifest();
