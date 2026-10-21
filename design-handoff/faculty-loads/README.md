# Faculty Loads Manager — editable Figma import

This is a prepared local importer, not an already-created Figma file. Desktop automation could not capture the Figma canvas, so the importer has not yet been run or visually verified in Figma.

## Create the design

1. Open a Figma Design file in the desktop app.
2. In Figma's main menu, choose **Plugins → Development → Import plugin from manifest…**.
3. Select `manifest.json` in this folder.
4. Run **Plugins → Development → Faculty Loads Manager — Design Import**.
5. A new page named **Faculty Loads Manager — Sample Designs** will contain four editable screens. Zoom to selection to see all four.

The importer adds a new page; it does not modify existing pages. Running it again adds another page.

## Screens

- Employee search, matching results, and the select-employee empty state.
- Selected employee profile and three teaching loads, totaling 13 Units/Hrs.
- Add Teaching Load drawer, with two selected subjects.
- My Faculty Members directory, clearly marked as a **proposed design** because the current source tab only contains placeholder text.

Styling follows the source's navy `#294a70`, pale blue badges, rounded cards, 420px drawer, system font preference, and text hierarchy. The screens represent the module at 1280 × 900; they do not recreate the surrounding application navigation. These are editable static screens, not an interactive prototype. Text, cards, controls, and illustrations are native Figma nodes rather than screenshots. All faculty records are fictional. No network requests are made by the importer.

## Share with interns

After checking the generated screens, share the Figma design file with your interns using view access. Alternatively, use Figma's **Save local copy** command to export a `.fig` file. Share the design link or `.fig` file only; do not send this importer folder or the application repository.
