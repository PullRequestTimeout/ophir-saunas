// Add-ons that share a choice_group are shown as one single choice (radio buttons); the rest stand alone.

/** Add-ons in display order, with each choice group gathered where its first member sorts. Standalone add-ons have group "". */
export function addOnSections<T extends { choice_group: string }>(addOns: T[]) {
	const sections: { group: string; addOns: T[] }[] = [];
	for (const addOn of addOns) {
		const section = addOn.choice_group ? sections.find((s) => s.group === addOn.choice_group) : undefined;
		if (section) section.addOns.push(addOn);
		else sections.push({ group: addOn.choice_group, addOns: [addOn] });
	}
	return sections;
}

/** The first choice group that `selectedIds` picks more than one add-on from, or null */
export function doubledChoiceGroup(addOns: { id: string; choice_group: string }[], selectedIds: string[]) {
	const seen = new Set<string>();
	for (const addOn of addOns) {
		if (!addOn.choice_group || !selectedIds.includes(addOn.id)) continue;
		if (seen.has(addOn.choice_group)) return addOn.choice_group;
		seen.add(addOn.choice_group);
	}
	return null;
}
