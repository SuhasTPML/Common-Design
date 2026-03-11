(function () {
  function createIcon(type) {
    if (type === "search") {
      return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6"></circle><path d="M20 20l-4.2-4.2"></path></svg>';
    }
    if (type === "menu") {
      return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"></path><path d="M4 12h16"></path><path d="M4 17h16"></path></svg>';
    }
    return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13v-2l12-5v12L4 13z"></path><path d="M16 9h2a3 3 0 0 1 0 6h-2"></path><path d="M7 14l1.5 5"></path></svg>';
  }

  function renderMenu(listElement, items) {
    listElement.replaceChildren();
    items.forEach(function (item, index) {
      var li = document.createElement("li");
      var link = document.createElement("a");
      link.href = "#";
      link.textContent = item;
      if (index === 0) {
        link.classList.add("is-active");
      }
      li.appendChild(link);
      listElement.appendChild(li);
    });
  }

  function renderFeatured(listElement, items) {
    listElement.replaceChildren();
    items.forEach(function (item) {
      var li = document.createElement("li");
      var link = document.createElement("a");
      link.href = "#";
      link.textContent = item.label;
      if (item.emphasis) {
        link.classList.add("featured-highlight");
      }
      li.appendChild(link);
      listElement.appendChild(li);
    });
  }

  function renderSwitcherButtons(host, switcher) {
    if (!host || !switcher) {
      return;
    }
    var buttonsHost = host.querySelector("[data-nav-switcher-buttons]");
    buttonsHost.replaceChildren();
    switcher.options.forEach(function (option) {
      var button = document.createElement("button");
      button.type = "button";
      button.dataset.brandTarget = option.key;
      button.textContent = option.label;
      button.setAttribute("aria-pressed", String(option.key === switcher.activeKey));
      buttonsHost.appendChild(button);
    });
  }

  function positionSwitcher(switcher) {
    if (!switcher) {
      return;
    }
    var viewportMargin = window.innerWidth <= 767.98 ? 12 : 16;
    var maxLeft = Math.max(viewportMargin, window.innerWidth - switcher.offsetWidth - viewportMargin);
    var top = Math.max(viewportMargin, (window.innerHeight - switcher.offsetHeight) / 2);
    switcher.style.left = maxLeft + "px";
    switcher.style.top = top + "px";
  }

  function clampSwitcher(switcher) {
    if (!switcher) {
      return;
    }
    var viewportMargin = window.innerWidth <= 767.98 ? 12 : 16;
    var maxLeft = Math.max(viewportMargin, window.innerWidth - switcher.offsetWidth - viewportMargin);
    var maxTop = Math.max(viewportMargin, window.innerHeight - switcher.offsetHeight - viewportMargin);
    var currentLeft = Number.parseFloat(switcher.style.left) || maxLeft;
    var currentTop = Number.parseFloat(switcher.style.top) || viewportMargin;
    switcher.style.left = Math.min(Math.max(currentLeft, viewportMargin), maxLeft) + "px";
    switcher.style.top = Math.min(Math.max(currentTop, viewportMargin), maxTop) + "px";
  }

  function mount(root, options) {
    if (!root) {
      throw new Error("SharedNavComponent.mount requires a root element.");
    }

    var state = {
      brand: options.brand || {},
      switcher: options.switcher || null,
      onBrandChange: options.onBrandChange || null
    };

    root.innerHTML =
      (state.switcher ? '<div class="brand-switcher" role="group" aria-label="Brand switcher"><span class="brand-switcher-handle" aria-hidden="true">::::</span><span data-nav-switcher-buttons></span></div>' : "") +
      '<header class="site-header">' +
        '<div class="header-container">' +
          '<div class="header-left">' +
            '<div class="logo" data-logo-mode="image">' +
              '<a href="#" data-nav-logo-link aria-label="Homepage">' +
                '<img data-nav-logo-image src="" alt="">' +
              '</a>' +
            '</div>' +
            '<nav class="desktop-nav-links" aria-label="Primary navigation">' +
              '<ul data-nav-desktop></ul>' +
            '</nav>' +
          '</div>' +
          '<div class="header-right">' +
            '<nav class="main-nav" aria-label="Header actions">' +
              '<button class="icon-button search-icon" type="button" aria-label="Search">' + createIcon("search") + "</button>" +
              '<a class="login-button" data-nav-login href="#"></a>' +
              '<a class="epaper-main-header-button" data-nav-epaper href="#"></a>' +
              '<button class="icon-button hamburger-icon" type="button" aria-label="Open menu">' + createIcon("menu") + "</button>" +
            "</nav>" +
          "</div>" +
        "</div>" +
      "</header>" +
      '<div class="mobile-menu-bar">' +
        '<div class="menu-container">' +
          '<nav class="mobile-nav-links" aria-label="Mobile section navigation">' +
            '<ul data-nav-mobile></ul>' +
          "</nav>" +
        "</div>" +
      "</div>" +
      '<nav class="featured-bar desktop-featured-bar" aria-label="Featured topics">' +
        '<div class="featured-container">' +
          '<span class="featured-icon-label topic-megaphone" aria-hidden="true">' + createIcon("bullhorn") + "</span>" +
          '<ul data-nav-featured></ul>' +
        "</div>" +
      "</nav>";

    var refs = {
      switcher: root.querySelector(".brand-switcher"),
      switcherHandle: root.querySelector(".brand-switcher-handle"),
      logoLink: root.querySelector("[data-nav-logo-link]"),
      logoImage: root.querySelector("[data-nav-logo-image]"),
      desktopNav: root.querySelector("[data-nav-desktop]"),
      mobileNav: root.querySelector("[data-nav-mobile]"),
      featuredNav: root.querySelector("[data-nav-featured]"),
      loginButton: root.querySelector("[data-nav-login]"),
      epaperButton: root.querySelector("[data-nav-epaper]")
    };

    var dragState = null;

    function wireSwitcher() {
      if (!refs.switcher || !refs.switcherHandle || !state.switcher) {
        return;
      }

      renderSwitcherButtons(root, state.switcher);
      positionSwitcher(refs.switcher);

      refs.switcherHandle.addEventListener("pointerdown", function (event) {
        var rect = refs.switcher.getBoundingClientRect();
        dragState = {
          pointerId: event.pointerId,
          offsetX: event.clientX - rect.left,
          offsetY: event.clientY - rect.top
        };
        refs.switcher.classList.add("is-dragging");
        refs.switcherHandle.setPointerCapture && refs.switcherHandle.setPointerCapture(event.pointerId);
        event.preventDefault();
      });

      window.addEventListener("pointermove", function (event) {
        if (!dragState || event.pointerId !== dragState.pointerId) {
          return;
        }
        var viewportMargin = window.innerWidth <= 767.98 ? 12 : 16;
        var maxLeft = Math.max(viewportMargin, window.innerWidth - refs.switcher.offsetWidth - viewportMargin);
        var maxTop = Math.max(viewportMargin, window.innerHeight - refs.switcher.offsetHeight - viewportMargin);
        var left = Math.min(Math.max(event.clientX - dragState.offsetX, viewportMargin), maxLeft);
        var top = Math.min(Math.max(event.clientY - dragState.offsetY, viewportMargin), maxTop);
        refs.switcher.style.left = left + "px";
        refs.switcher.style.top = top + "px";
      });

      function endDrag(event) {
        if (!dragState || (event.pointerId !== undefined && event.pointerId !== dragState.pointerId)) {
          return;
        }
        refs.switcherHandle.releasePointerCapture && refs.switcherHandle.releasePointerCapture(dragState.pointerId);
        dragState = null;
        refs.switcher.classList.remove("is-dragging");
      }

      window.addEventListener("pointerup", endDrag);
      window.addEventListener("pointercancel", endDrag);
      window.addEventListener("resize", function () {
        if (dragState) {
          return;
        }
        if (!refs.switcher.style.left || !refs.switcher.style.top) {
          positionSwitcher(refs.switcher);
          return;
        }
        clampSwitcher(refs.switcher);
      });

      root.querySelectorAll(".brand-switcher button[data-brand-target]").forEach(function (button) {
        button.addEventListener("click", function () {
          if (typeof state.onBrandChange === "function") {
            state.onBrandChange(button.dataset.brandTarget);
          }
        });
      });
    }

    function update(next) {
      if (next.brand) {
        state.brand = next.brand;
      }
      if (next.switcher) {
        state.switcher = next.switcher;
        renderSwitcherButtons(root, state.switcher);
        root.querySelectorAll(".brand-switcher button[data-brand-target]").forEach(function (button) {
          button.addEventListener("click", function () {
            if (typeof state.onBrandChange === "function") {
              state.onBrandChange(button.dataset.brandTarget);
            }
          });
        });
      }

      refs.logoLink.href = state.brand.homeHref || "#";
      refs.logoLink.setAttribute("aria-label", state.brand.logoAria || "Homepage");
      refs.logoImage.src = state.brand.logoSrc || "";
      refs.logoImage.alt = state.brand.logoAlt || "";
      refs.logoImage.style.height = state.brand.logoHeight || "";
      refs.logoImage.style.maxWidth = state.brand.logoMaxWidth || "";
      refs.loginButton.href = state.brand.loginHref || "#";
      refs.loginButton.textContent = state.brand.loginLabel || "Login";
      refs.epaperButton.href = state.brand.epaperHref || "#";
      refs.epaperButton.textContent = state.brand.epaperLabel || "Subscribe";
      renderMenu(refs.desktopNav, state.brand.desktopNav || []);
      renderMenu(refs.mobileNav, state.brand.mobileNav || []);
      renderFeatured(refs.featuredNav, state.brand.featured || []);

      if (state.switcher) {
        root.querySelectorAll(".brand-switcher button[data-brand-target]").forEach(function (button) {
          button.setAttribute("aria-pressed", String(button.dataset.brandTarget === state.switcher.activeKey));
        });
      }
    }

    wireSwitcher();
    update({ brand: state.brand, switcher: state.switcher });

    return {
      update: update
    };
  }

  window.SharedNavComponent = {
    mount: mount
  };
})();
