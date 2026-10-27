import { describe, expect, it } from "vitest";
import { addOnSections, doubledChoiceGroup } from "./addOns";

const addOns = [
	{ id: "w3", choice_group: "Firewood" },
	{ id: "plunge", choice_group: "" },
	{ id: "w6", choice_group: "Firewood" },
	{ id: "towels", choice_group: "" }
];

describe("add-on choice groups", () => {
	it("gathers a group where its first member sorts and keeps standalone add-ons separate", () => {
		expect(addOnSections(addOns).map((s) => [s.group, s.addOns.map((a) => a.id)])).toEqual([
			["Firewood", ["w3", "w6"]],
			["", ["plunge"]],
			["", ["towels"]]
		]);
	});

	it("only flags two picks from the same group", () => {
		expect(doubledChoiceGroup(addOns, ["w3", "plunge", "towels"])).toBeNull();
		expect(doubledChoiceGroup(addOns, ["w3", "w6"])).toBe("Firewood");
	});
});
