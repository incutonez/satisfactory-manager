import { FieldText, IFieldText } from "@/components/FieldText.tsx";

export function FieldNumber({ ...props }: IFieldText<number>) {
	const { setter } = props;
	props.type = "number";
	props.value ??= "";
	// We override the original setter, so we can use a number here
	function setValue(value?: number) {
		setter(value ? Number(value) : undefined);
	}

	return (
		<FieldText<number>
			{...props}
			setter={setValue}
		/>
	);
}
