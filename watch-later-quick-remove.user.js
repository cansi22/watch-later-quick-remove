// ==UserScript==
// @name:es         Borrado rapido de Ver más tarde
// @name            Quick Remove from Watch Later
// @namespace       https://github.com/cansi22
// @version         1.0.1
// @description:es  Elimina vídeos de "Ver más tarde" con un solo clic
// @description     Removes videos from "Watch Later" with a single click
// @author          cansi22
// @license         MIT
//
// @match           https://www.youtube.com/playlist?list=WL*
// @icon            data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0icmVkIj48cGF0aCBkPSJNOSwzVjRINFY2SDVWMTlBMiwyIDAgMCwwIDcsMjFIMTdBMiwyIDAgMCwwIDE5LDE5VjZIMjBWNEgxNVYzSDlNNyw4SDlWMTdIN1Y4TTExLDhIMTNWMTdIMTFWOE0xNSw4SDE3VjE3SDE1VjhaIi8+PC9zdmc+
//
// @homepageURL     https://github.com/cansi22/watch-later-quick-remove/
// @supportURL      https://github.com/cansi22/watch-later-quick-remove/issues
// @updateURL       https://raw.githubusercontent.com/cansi22/watch-later-quick-remove/main/watch-later-quick-remove.user.js
// @downloadURL     https://raw.githubusercontent.com/cansi22/watch-later-quick-remove/main/watch-later-quick-remove.user.js
//
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const trashIconSVG = `
    <svg width="24" height="24" viewBox="0 0 24 24" style="vertical-align:middle; display:block;" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 3V4H4V6H5V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V6H20V4H15V3H9ZM7 6H17V19H7V6ZM9 8V17H11V8H9ZM13 8V17H15V8H13Z" fill="red"/>
    </svg>
    `;

    function addTrashButtons() {
        document.querySelectorAll('ytd-playlist-video-renderer:not([data-trash-added])').forEach(video => {
            video.setAttribute('data-trash-added', 'true');

            // Crear botón de papelera con SVG
            const btn = document.createElement('button');
            btn.innerHTML = trashIconSVG;
            btn.title = 'Quitar de Ver más tarde';
            btn.style.margin = '0 8px 0 0'; // margen solo a la derecha
            btn.style.cursor = 'pointer';
            btn.style.fontSize = '18px';
            btn.style.background = 'transparent';
            btn.style.border = 'none';
            btn.style.display = 'inline-flex';
            btn.style.alignItems = 'center';
            btn.style.height = '40px'; // igualar altura del botón de menu
            btn.style.padding = '0';
            btn.style.verticalAlign = 'middle';

            btn.onclick = function (e) {
                e.stopPropagation();
                const menuBtn = video.querySelector('yt-icon-button#button > button#button');
                if (menuBtn) {
                    menuBtn.click();
                    const interval = setInterval(() => {
                        const items = Array.from(document.querySelectorAll('ytd-menu-service-item-renderer'));
                        const removeBtn = items.find(item =>
                            item.innerText.trim() === 'Quitar de Ver más tarde' ||
                            item.innerText.trim() === 'Remove from Watch later'
                        );
                        if (removeBtn) {
                            clearInterval(interval);
                            removeBtn.click();
                            document.body.click();
                        }
                    }, 100);
                    setTimeout(() => clearInterval(interval), 3000);
                } else {
                    alert('No se encontró el botón de menú.');
                }
            };

            // Insertar la papelera antes del menú de los tres puntos
            const menu = video.querySelector('yt-icon-button#button');
            if (menu && menu.parentElement) {
                menu.parentElement.insertBefore(btn, menu);
            }
        });
    }

    const observer = new MutationObserver(addTrashButtons);
    observer.observe(document.body, { childList: true, subtree: true });

    addTrashButtons();
})();