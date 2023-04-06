export function transformFormData(formData: FormData) {
  const res: Record<string, any> = {};
  formData.forEach((value, key) => {
    res[key as keyof typeof res] = value;
  });
  return res;
}
