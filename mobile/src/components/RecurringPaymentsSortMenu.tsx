import { SelectModal, type SelectModalOption } from "@/components/SelectModal";

export type RecurringPaymentSortBy = "due_date" | "amount" | "name";

export type SortOrder = "ASC" | "DESC";

export type RecurringPaymentSort = {
  label?: string;
  sort_by?: RecurringPaymentSortBy;
  sort_order?: SortOrder;
};

type SortMenuOption = SelectModalOption & {
  sort_by: RecurringPaymentSortBy;
  sort_order: SortOrder;
};

const SORT_OPTIONS: SortMenuOption[] = [
  {
    label: "Due Date: Earliest first",
    value: "due_date_ASC",
    sort_by: "due_date",
    sort_order: "ASC",
  },
  {
    label: "Due Date: Latest first",
    value: "due_date_DESC",
    sort_by: "due_date",
    sort_order: "DESC",
  },
  {
    label: "Amount: Low to High",
    value: "amount_ASC",
    sort_by: "amount",
    sort_order: "ASC",
  },
  {
    label: "Amount: High to Low",
    value: "amount_DESC",
    sort_by: "amount",
    sort_order: "DESC",
  },
  {
    label: "Name: A to Z",
    value: "name_ASC",
    sort_by: "name",
    sort_order: "ASC",
  },
  {
    label: "Name: Z to A",
    value: "name_DESC",
    sort_by: "name",
    sort_order: "DESC",
  },
];

type RecurringPaymentsSortMenuProps = {
  visible: boolean;
  onClose: () => void;
  value: RecurringPaymentSort;
  onSelect: (sort: RecurringPaymentSort) => void;
};

export const hasActiveSort = (sort: RecurringPaymentSort) =>
  sort.sort_by !== undefined || sort.sort_order !== undefined;

export const RecurringPaymentsSortMenu = ({
  visible,
  onClose,
  value,
  onSelect,
}: RecurringPaymentsSortMenuProps) => {
  const selectedOption = SORT_OPTIONS.find(
    (option) =>
      option.sort_by === value.sort_by &&
      option.sort_order === value.sort_order,
  );

  const handleSelect = (optionValue: string) => {
    const option = SORT_OPTIONS.find((o) => o.value === optionValue);
    if (!option) return;

    onSelect({
      label: option.label,
      sort_by: option.sort_by,
      sort_order: option.sort_order,
    });
  };

  return (
    <SelectModal
      visible={visible}
      onClose={onClose}
      title="Sort By"
      options={SORT_OPTIONS}
      value={selectedOption?.value}
      onSelect={handleSelect}
    />
  );
};
