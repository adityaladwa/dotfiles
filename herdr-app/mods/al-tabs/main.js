import { View, div, svg, image } from "gpui-kit";
import { h_flex } from "gpui-base";
import { spaces, panes, run, openOverlay, theme, home, window as win, shared, setShared, layout, settings } from "herdr";

function find(node, id) {
  if (node?.id === id) return node;
  for (const child of node?.children ?? []) {
    const found = find(child, id);
    if (found) return found;
  }
  return null;
}

function folder(cwd) {
  if (!cwd) return "";
  const h = home();
  return cwd === h ? "~" : cwd.startsWith(h + "/") ? "~" + cwd.slice(h.length) : cwd;
}

function lead(all, id) {
  const mine = all.filter((p) => p.tab === id);
  return mine.find((p) => p.focused) ?? mine.find((p) => p.program?.agent) ?? mine[0];
}

function tile(t, p) {
  const g = p?.program;
  const dot = p?.status && p.status !== "idle" ? t[p.status] : null;
  return div()
    .relative()
    .flex_none()
    .size(24)
    .rounded(6)
    .border_1()
    .border_color("#ffffff14")
    .bg(g?.tile ?? (t.chip ?? "#282a36"))
    .flex()
    .items_center()
    .justify_center()
    .when(Boolean(g?.icon), (el) =>
      el.child(g.tint ? svg(g.icon).size(14).text_color(g.color ?? (t.foreground ?? "#eff0eb")) : image(g.icon).size(14)),
    )
    .when(Boolean(dot), (el) =>
      el.child(div().absolute().top(-3).right(-3).size(9).rounded_full().border_2().border_color(t.tray ?? "#191a21").bg(dot)),
    );
}

function own(el) {
  return el.on_mouse_down("left", (_e, cx) => cx.stop_propagation()).on_mouse_down("right", (_e, cx) => cx.stop_propagation());
}

export default class AlTabs extends View {
  init() {
    this.pressed = null;
    this.panels = JSON.parse(localStorage.getItem("panels") ?? "{}");
    const p = shared("workspace.panels");
    if (!Array.isArray(p) || !p.includes("files") || !p.includes("changes")) {
      setShared("workspace.panels", ["files", "changes"]);
    }
  }

  syncPanel(space, panel, body, enabled) {
    if (!space || !panel) return;
    const now = panel.hidden ? null : body?.active ?? null;
    if (space.id !== this.space) {
      const first = this.space === undefined;
      this.space = space.id;
      this.pending = null;
      if (!(first && !(space.id in this.panels))) {
        const stored = this.panels[space.id] ?? null, want = enabled.includes(stored) ? stored : null;
        if (want !== now) {
          this.pending = { want, until: Date.now() + 1000 };
          if (want) { run("layout.select", { stack: "panel-body", child: want }); run("layout.show", { id: "panel" }); }
          else run("layout.hide", { id: "panel" });
          return;
        }
      }
    }
    if (this.pending) {
      if (this.pending.want !== now && Date.now() < this.pending.until) return;
      this.pending = null;
    }
    if (this.panels[space.id] === now) return;
    this.panels[space.id] = now;
    localStorage.setItem("panels", JSON.stringify(this.panels));
  }

  render() {
    const t = theme();
    const space = spaces().find((p) => p.active);
    if (!space) return div();
    const shown = space.tabs ?? [];
    const all = panes();
    const root = layout();
    const sidebar = find(root, "sidebar");
    const w = win() ?? {};

    const lightsPadding = w.platform === "macos" && w.titlebar === "none" && !w.fullscreen && root?.traffic_lights
      ? Math.max(10, (root.traffic_lights[0] + 64) / settings().zoom - (sidebar?.hidden ? 0 : sidebar?.size?.px ?? 0))
      : 10;

    const panel = find(root, "panel"), body = find(root, "panel-body");
    const sp = shared("workspace.panels");
    const enabled = Array.isArray(sp) && sp.length > 0 ? sp : ["files", "changes"];
    this.syncPanel(space, panel, body, enabled);

    const stop = (_e, cx) => cx.stop_propagation();

    const tabItem = (c, i) => {
      const p = lead(all, c.id);
      const where = folder(p?.cwd);
      const program = p?.program;
      const name = /^tb\d+$/.test(c.name) ? program?.name ?? "Terminal" : c.name;

      return own(h_flex())
        .id(`tm-${c.id}`)
        .flex_none()
        .min_w(130)
        .max_w(240)
        .h_full()
        .px(7)
        .gap(7)
        .items_center()
        .rounded(8)
        .border_1()
        .cursor_pointer()
        .text_size(12)
        .when(c.active, (el) => el.bg(t.tab ?? "#343746").border_color(t.tabEdge ?? "#44475a"))
        .when(!c.active, (el) => el.border_color("#00000000").hover((s) => s.bg(t.hover ?? "#ffffff0f")))
        .on_mouse_down("left", (e, cx) => {
          cx.stop_propagation();
          this.pressed = i;
          if (e.click_count === 2) run("tab.rename", { id: c.id });
        })
        .on_mouse_up("left", () => {
          const from = this.pressed;
          this.pressed = null;
          if (from !== null && from !== i) run("tab.move", { id: shown[from].id, index: space.tabs.findIndex((x) => x.id === c.id) + 1 });
          else run("tab.select", { id: c.id });
        })
        .on_mouse_down("right", (_e, cx) => {
          cx.stop_propagation();
          openOverlay({ mod: "menu", kind: "popup", width: 200, props: { tab: "tab", target: { id: c.id, space: space.id } } });
        })
        .child(tile(t, p))
        .child(
          h_flex()
            .flex_1()
            .min_w(0)
            .gap(5)
            .truncate()
            .child(div().flex_none().font_weight(500).text_color(c.active ? (t.foreground ?? "#eff0eb") : (t.muted ?? "#a9adb3")).child(c.zoomed ? `${name} Z` : name))
            .when(Boolean(where), (el) => el.child(div().truncate().text_color(t.dim ?? "#686868").child(where))),
        )
        .when(c.status === "working", (el) => el.child(svg("mods/workspace-chrome/spinner.svg").size(11).flex_none().text_color(t.working).spin(900)))
        .when(c.status === "blocked" || c.status === "done", (el) => el.child(div().size(6).rounded_full().bg(t[c.status])))
        .when(c.active, (el) =>
          el.child(
            div()
              .id(`close-${c.id}`)
              .text_color(t.dim ?? "#686868")
              .hover((s) => s.text_color(t.foreground ?? "#eff0eb"))
              .on_mouse_down("left", stop)
              .on_click((_e, cx) => {
                cx.stop_propagation();
                run("tab.close", { id: c.id });
              })
              .child(svg("mods/pane/close.svg").size(10)),
          ),
        );
    };

    const actionButton = (id, icon, onClick) =>
      own(div())
        .id(id)
        .flex_none()
        .size(26)
        .rounded(6)
        .flex()
        .items_center()
        .justify_center()
        .text_color(t.muted ?? "#a9adb3")
        .cursor_pointer()
        .hover((s) => s.bg(t.raised ?? "#343746").text_color(t.foreground ?? "#eff0eb"))
        .on_click(onClick)
        .child(svg(icon).size(14));

    const panelButton = (id, label, icon) => {
      const on = panel && !panel.hidden && body?.active === id;
      return own(h_flex())
        .id(`panel-${id}`)
        .h(26)
        .px(8)
        .gap(5)
        .flex_none()
        .items_center()
        .rounded(6)
        .text_size(11)
        .cursor_pointer()
        .bg(on ? (t.raised ?? "#343746") : "#00000000")
        .border_1()
        .border_color(on ? (t.tabEdge ?? "#44475a") : "#00000000")
        .text_color(on ? (t.foreground ?? "#eff0eb") : (t.muted ?? "#a9adb3"))
        .hover((s) => s.bg(t.hover ?? "#ffffff0f").text_color(t.foreground ?? "#eff0eb"))
        .on_click(() => {
          if (on) run("layout.hide", { id: "panel" });
          else {
            run("layout.select", { stack: "panel-body", child: id });
            run("layout.show", { id: "panel" });
          }
        })
        .child(svg(icon).size(13))
        .child(label);
    };

    const windowButton = (id, icon, command) =>
      own(div())
        .id(id)
        .flex_none()
        .size(24)
        .rounded_full()
        .flex()
        .items_center()
        .justify_center()
        .bg(t.chip ?? "#282a36")
        .text_color(t.dim ?? "#686868")
        .cursor_pointer()
        .hover((s) => s.bg(t.raised ?? "#343746").text_color(t.foreground ?? "#eff0eb"))
        .on_click(() => run(command))
        .child(svg(`mods/al-tabs/${icon}.svg`).size(13));

    return h_flex()
      .size_full()
      .min_w(0)
      .px(10)
      .pl(lightsPadding)
      .gap(8)
      .items_center()
      .on_mouse_up("left", () => {
        this.pressed = null;
      })
      .on_scroll_wheel((e) => {
        if (Math.abs(e.delta.y) >= 1) run(e.delta.y > 0 ? "tab.prev" : "tab.next");
      })
      .child(
        h_flex()
          .id("tab-tray")
          .flex_1()
          .min_w(0)
          .h(34)
          .p(2)
          .gap(3)
          .rounded(10)
          .bg(t.tray ?? "#191a21")
          .overflow_x_scrollbar()
          .children(shown.map(tabItem)),
      )
      .child(actionButton("tab-new", "mods/al-tabs/plus.svg", () => openOverlay({ mod: "new-menu", kind: "popup", width: 250, height: 512 })))
      .when(enabled.includes("files"), (el) => el.child(panelButton("files", "Files", "mods/files/file.svg")))
      .when(enabled.includes("changes"), (el) => el.child(panelButton("changes", "Changes", "mods/changes/changes.svg")))
      .when(Boolean(w.buttons), (el) =>
        el.child(
          h_flex()
            .flex_none()
            .pl(4)
            .gap(6)
            .child(windowButton("tm-min", "win-min", "window.minimize"))
            .child(windowButton("tm-max", w.maximized ? "win-restore" : "win-max", "window.maximize"))
            .child(windowButton("tm-close", "win-close", "window.close")),
        ),
      );
  }
}
