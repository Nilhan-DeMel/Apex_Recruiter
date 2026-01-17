import { CandidatePersona } from "@/lib/store/vacancy-store";

// PDF Export using browser print
export function exportToPDF(vacancyName: string, personas: CandidatePersona[]) {
    const content = generateHTMLContent(vacancyName, personas);

    const printWindow = window.open("", "_blank");
    if (printWindow) {
        printWindow.document.write(content);
        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
        }, 250);
    }
}

// DOCX Export (simplified - downloads as HTML that Word can open)
export function exportToDOCX(vacancyName: string, personas: CandidatePersona[]) {
    const content = generatePlainContent(vacancyName, personas);

    const blob = new Blob([content], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    downloadBlob(blob, `${sanitizeFilename(vacancyName)}_personas.docx`);
}

// JSON Export
export function exportToJSON(vacancyName: string, personas: CandidatePersona[]) {
    const data = {
        vacancyName,
        exportedAt: new Date().toISOString(),
        personas: personas.map(p => ({
            type: p.type,
            headline: p.headline,
            summary: p.summary,
            coreSkills: p.coreSkills,
            domainExperience: p.domainExperience,
            typicalEmployers: p.typicalEmployers,
            salaryBand: p.salaryBand,
            noticePeriod: p.noticePeriod,
            redFlags: p.redFlags,
            outreachAngle: p.outreachAngle,
            booleanSearchStrings: p.booleanSearchStrings,
            approved: p.approved,
        })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    downloadBlob(blob, `${sanitizeFilename(vacancyName)}_personas.json`);
}

function generateHTMLContent(vacancyName: string, personas: CandidatePersona[]): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${vacancyName} - Candidate Personas</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #333; }
    h1 { color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px; }
    h2 { color: #4f46e5; margin-top: 30px; }
    .persona { page-break-inside: avoid; margin-bottom: 40px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 10px; }
    .safe_fit { background: #dcfce7; color: #166534; }
    .stretch_fit { background: #dbeafe; color: #1e40af; }
    .high_potential { background: #f3e8ff; color: #7c3aed; }
    .budget_fit { background: #fef9c3; color: #854d0e; }
    .fast_joiner { background: #ffedd5; color: #c2410c; }
    .niche_specialist { background: #fce7f3; color: #be185d; }
    .section { margin: 15px 0; }
    .section-title { font-size: 12px; color: #6b7280; text-transform: uppercase; margin-bottom: 5px; }
    .skills { display: flex; flex-wrap: wrap; gap: 5px; }
    .skill { background: #f3f4f6; padding: 3px 8px; border-radius: 4px; font-size: 13px; }
    .salary { font-weight: 600; }
    .note { font-style: italic; color: #6b7280; font-size: 13px; }
    .red-flags { color: #dc2626; }
    code { background: #f3f4f6; padding: 8px 12px; display: block; border-radius: 4px; font-size: 12px; overflow-x: auto; margin: 5px 0; }
    .approved { color: #16a34a; }
    @media print { .persona { page-break-inside: avoid; } }
  </style>
</head>
<body>
  <h1>${vacancyName}</h1>
  <p style="color: #6b7280;">Candidate Personas • Generated ${new Date().toLocaleDateString()}</p>
  
  ${personas.map(persona => `
    <div class="persona">
      <span class="badge ${persona.type}">${formatType(persona.type)}</span>
      ${persona.approved ? '<span class="approved"> ✓ Approved</span>' : ''}
      <h2>${persona.headline}</h2>
      
      <div class="section">
        <div class="section-title">Summary</div>
        <p>${persona.summary}</p>
      </div>
      
      <div class="section">
        <div class="section-title">Core Skills</div>
        <div class="skills">
          ${persona.coreSkills.map(s => `<span class="skill">${s}</span>`).join('')}
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Salary Band</div>
        <p class="salary">${persona.salaryBand.currency} ${persona.salaryBand.min.toLocaleString()} - ${persona.salaryBand.max.toLocaleString()}</p>
        <p class="note">${persona.salaryBand.note}</p>
      </div>
      
      <div class="section">
        <div class="section-title">Typical Employers</div>
        <p>${persona.typicalEmployers.join(', ')}</p>
      </div>
      
      <div class="section">
        <div class="section-title">Notice Period</div>
        <p>${persona.noticePeriod}</p>
      </div>
      
      ${persona.redFlags.length > 0 ? `
        <div class="section">
          <div class="section-title red-flags">Red Flags / Risks</div>
          <ul>${persona.redFlags.map(f => `<li>${f}</li>`).join('')}</ul>
        </div>
      ` : ''}
      
      <div class="section">
        <div class="section-title">Outreach Angle</div>
        <p class="note">"${persona.outreachAngle}"</p>
      </div>
      
      ${persona.booleanSearchStrings.length > 0 ? `
        <div class="section">
          <div class="section-title">Boolean Search Strings</div>
          ${persona.booleanSearchStrings.map(s => `<code>${s}</code>`).join('')}
        </div>
      ` : ''}
    </div>
  `).join('')}
</body>
</html>
  `;
}

function generatePlainContent(vacancyName: string, personas: CandidatePersona[]): string {
    let content = `${vacancyName}\nCandidate Personas\nGenerated: ${new Date().toLocaleDateString()}\n\n`;

    personas.forEach((persona, index) => {
        content += `${'='.repeat(60)}\n`;
        content += `PERSONA ${index + 1}: ${formatType(persona.type).toUpperCase()}\n`;
        content += `${'='.repeat(60)}\n\n`;
        content += `${persona.headline}\n`;
        content += `${persona.approved ? '[APPROVED]' : '[PENDING]'}\n\n`;
        content += `SUMMARY\n${persona.summary}\n\n`;
        content += `CORE SKILLS\n${persona.coreSkills.join(', ')}\n\n`;
        content += `SALARY BAND\n${persona.salaryBand.currency} ${persona.salaryBand.min.toLocaleString()} - ${persona.salaryBand.max.toLocaleString()}\n${persona.salaryBand.note}\n\n`;
        content += `TYPICAL EMPLOYERS\n${persona.typicalEmployers.join(', ')}\n\n`;
        content += `NOTICE PERIOD\n${persona.noticePeriod}\n\n`;

        if (persona.redFlags.length > 0) {
            content += `RED FLAGS / RISKS\n${persona.redFlags.map(f => `• ${f}`).join('\n')}\n\n`;
        }

        content += `OUTREACH ANGLE\n"${persona.outreachAngle}"\n\n`;

        if (persona.booleanSearchStrings.length > 0) {
            content += `BOOLEAN SEARCH STRINGS\n${persona.booleanSearchStrings.join('\n')}\n\n`;
        }
    });

    return content;
}

function formatType(type: string): string {
    return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function sanitizeFilename(name: string): string {
    return name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
}

function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
