import { test } from "node:test";
import assert from "node:assert/strict";
import { filterServices, services, type Service } from "../src/shared/data";
import { mapsSearchUrl } from "../src/shared/listings";

test("real listings have dated first-party evidence without claiming direct confirmation", () => {
  assert.equal(services.length, 3);
  assert.equal(new Set(services.map((s) => s.id)).size, services.length);
  for (const s of services) {
    assert.equal(s.verificationStatus, "source-checked");
    assert.equal(s.providerConfirmedAt, null);
    assert.match(s.lastChecked!, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(s.sources.some((source) => source.url === s.sourceUrl));
    for (const field of [
      "name",
      "description",
      "audience",
      "district",
      "address",
      "phone",
      "email",
      "hours",
    ] as const) {
      if (s[field] !== null)
        assert.ok(
          s.sources.some((source) => source.fields.includes(field)),
          `${s.id}: missing evidence for ${field}`,
        );
    }
    for (const source of s.sources) {
      assert.equal(new URL(source.url).protocol, "https:");
      assert.equal(source.checkedAt, s.lastChecked);
    }
    assert.equal(s.cost, "unknown");
    assert.equal(s.documents.length, 0);
    assert.ok(Object.values(s.access).every((value) => value === null));
  }
});
test("search supports both languages, whitespace and case", () => {
  assert.deepEqual(
    filterServices(services, { q: "  EMPLOYMENT SUPPORT CENTRE  " }).map(
      (s) => s.id,
    ),
    ["employment-support-centre"],
  );
  assert.ok(
    filterServices(services, { q: "хараагүй" }).some(
      (s) => s.id === "mongolian-national-federation-of-the-blind",
    ),
  );
  assert.equal(filterServices(services, { q: "not-a-service" }).length, 0);
});
test("office district and category filters intersect", () => {
  assert.deepEqual(
    filterServices(services, {
      category: "4",
      district: "Сүхбаатар",
      cost: "unknown",
    }).map((s) => s.id),
    ["employment-support-centre"],
  );
  assert.equal(
    filterServices(services, { category: "4", district: "Баянгол" }).length,
    0,
  );
});
test("category zero and multiple accessibility requirements are handled correctly", () => {
  const fixture: Service = {
    ...services[0],
    category: 0,
    cost: "free",
    access: {
      stepFree: true,
      lift: null,
      toilet: null,
      text: true,
      sign: null,
    },
  };
  assert.equal(
    filterServices([fixture], {
      category: "0",
      cost: "free",
      access: ["stepFree", "text"],
    }).length,
    1,
  );
  assert.equal(
    filterServices([fixture], { access: ["stepFree", "lift"] }).length,
    0,
  );
});
test("unknown cost or accessibility is never presented as free or accessible", () => {
  assert.equal(filterServices(services, { cost: "free" }).length, 0);
  assert.equal(filterServices(services, { access: ["sign"] }).length, 0);
  assert.equal(filterServices(services, { access: ["bogus"] }).length, 0);
  assert.equal(
    filterServices(services, { cost: "unknown" }).length,
    services.length,
  );
});
test("map links encode the published address without inventing a location pin", () => {
  for (const s of services) {
    const url = new URL(mapsSearchUrl(s)!);
    assert.equal(url.origin, "https://www.google.com");
    assert.equal(url.searchParams.get("api"), "1");
    assert.equal(
      url.searchParams.get("query"),
      `${s.name.mn}, ${s.address!.mn}`,
    );
    assert.equal(url.searchParams.has("query_place_id"), false);
  }
  assert.equal(mapsSearchUrl({ ...services[0], address: null }), null);
});
