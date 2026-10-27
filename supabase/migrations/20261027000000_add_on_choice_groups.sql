-- Add-ons that share a choice_group are offered as a single choice (pick at most one), e.g. the wood bundles.
-- An empty group means the add-on stands alone. The booking endpoints reject two add-ons from the same group.

alter table add_ons add column choice_group text not null default '';

update add_ons set choice_group = 'Firewood', max_quantity = 1 where name ilike '%wood bundle%';
