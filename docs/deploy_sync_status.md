# Deploy Sync Status: Apex Recruiter (Live)

## Definition of Done (SWIFT LANE)

- [x] **D1: Git Status Clean** -> Verified (Safety branch pushed).
- [x] **D2: Correct Site Deployment** -> Verified Target `live` -> `apex-recruiter-p1`.
- [x] **D3: Live Build Stamp** -> Verified `39fe31f` in live HTML.
- [x] **D4: Proof Bundle Complete** -> Populated in `docs/proof_bundle/deploy/`.

## Deployment Mapping

- **Domain**: <https://apex-recruiter-p1.web.app>
- **Project ID**: `apex-recruiter-p1`
- **Site ID**: `apex-recruiter-p1`
- **Target Name**: `live`

## Verification Results

- **Expected SHA**: `39fe31f`
- **Actual HTML Content**: `Build: 39fe31f`
- **Visual Proof**: `docs/proof_bundle/deploy/30_live_build_stamp.png`

## Checklist

1. Phase 0: Baseline Snapshots captured.
2. Phase 1: Destination site identified and target locked.
3. Phase 2: Build stamp injected and git state committed.
4. Phase 3: Production build deployed to target site.
5. Phase 4: Live verification (HTML + Visual) succeeded.
