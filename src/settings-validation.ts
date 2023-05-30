import { CustomName, NamesMap } from "settings";

export function validate(namesMap: NamesMap): ValidationResult {
  const customNames = Object.keys(namesMap).reduce((acc, originalName) => {
    return [...acc, namesMap[originalName]];
  }, [] as CustomName[]);

  if (hasEmptyValues(customNames)) {
    return error("Device name cannot be empty");
  }

  if (hasDuplicates(customNames)) {
    return error("Devices need to have unique names");
  }

  return ok();
}

function hasEmptyValues(names: CustomName[]) {
  return (
    names.filter((n) => n === "" || n === null || n === undefined).length > 0
  );
}

function hasDuplicates(names: CustomName[]) {
  const set = new Set(names);

  return set.size !== names.length;
}

function ok() {
  return {
    isOk: true,
    errorMessage: null,
  };
}

function error(message: string) {
  return {
    isOk: false,
    errorMessage: message,
  };
}

export interface ValidationResult {
  isOk: boolean;
  errorMessage: string | null;
}
