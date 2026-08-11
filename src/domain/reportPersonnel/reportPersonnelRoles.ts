// Path: server/src/domain/reportPersonnel/reportPersonnelRoles.ts
export interface PersonnelRole {
  key: string;
  label: string;
  multiple: boolean; // true = many people can hold this role on this report; false = at most one
}

export const REPORT_PERSONNEL_ROLES: Record<string, PersonnelRole[]> = {
  checksheet: [
    { key: "cleaned_by", label: "Cleaned By", multiple: false },
    { key: "checked_by", label: "Checked By", multiple: false },
  ],
  damage_report: [
    { key: "dismantled_by", label: "Dismantled By", multiple: false },
    { key: "dismantle_supported_by", label: "Dismantle Supported By", multiple: true },
  ],
  final_inspection: [
    { key: "assembly_done_by", label: "Assembly Done By", multiple: false },
    { key: "assembly_supported_by", label: "Assembly Supported By", multiple: true },
  ],
  testing_balancing: [
    { key: "testing_checked_by", label: "Checked By", multiple: false },
    { key: "testing_approved_by", label: "Approved By", multiple: false },
  ],
  in_process_inspection: [
    { key: "inspected_by", label: "Inspected By", multiple: false },
  ],
};
