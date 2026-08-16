import test from "node:test";
import assert from "node:assert/strict";
import { parseBibTeX, formatCitation } from "../lib/bibtex.mjs";
test("parses and formats an article",()=>{const c=parseBibTeX(`@article{demo, author={Doe, Jane and Islam, Habib}, title={Gauge Dynamics}, journal={Physical Review D}, year={2026}, volume={12}, pages={1--9}}`);assert.deepEqual(c.authors,["Doe, Jane","Islam, Habib"]);assert.match(formatCitation(c),/Doe, Jane; Islam, Habib/);assert.match(formatCitation(c),/Gauge Dynamics/);});
test("requires title and author",()=>assert.throws(()=>parseBibTeX("@misc{x, year={2026}}"),/requires author and title/));
test("handles nested braces, multiple authors, and DOI",()=>{
  const c=parseBibTeX("@article{x, author={Doe, Jane and Roe, John}, title={{SU(2)} Gauge {Dynamics}}, doi={10.1234/example}, year={2026}}");
  assert.deepEqual(c.authors,["Doe, Jane","Roe, John"]);
  assert.equal(c.title,"{SU(2)} Gauge {Dynamics}");
  assert.match(formatCitation(c),/doi:10\.1234\/example/);
});
test("rejects malformed fields with a useful error",()=>assert.throws(()=>parseBibTeX("@article{x, author={Doe, Jane}, title={Missing brace}"),/unclosed|requires/));
