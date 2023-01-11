import { anyEnv, typedEnv } from "./typed-env";

test("boolean env", () => {
  process.env["NX_WORKSPACE_ROOT"] = "true";
  const envBox = typedEnv("NX_WORKSPACE_ROOT");
  const rs = envBox.required().toBoolean();
  expect(rs).toBe(true);

  process.env["ENV_TEXT_BOOLEAN_2"] = "false";
  const envBox2 = anyEnv("ENV_TEXT_BOOLEAN_2");
  const s = envBox2.optional().toBoolean();
  expect(s).toBe(false);
});

test("integer env", () => {
  process.env["ENV_TEST_NUMBER"] = "123";
  const envBox = typedEnv("ENV_TEST_NUMBER");
  const rs = envBox.required().toInt();
  expect(rs).toBe(123);

  const envBox2 = anyEnv("ENV_TEST_NUMBER_2");
  const s = envBox2.optional().toInt();
  expect(s).toBe(undefined);
});

test("string env", () => {
  process.env["NX_WORKSPACE_ROOT"] = "aaa";
  const envBox = typedEnv("NX_WORKSPACE_ROOT");
  const rs = envBox.required().toString();
  expect(rs).toBe("aaa");

  const envBox2 = anyEnv("ENV_TEST_STRING_2");
  const s = envBox2.optional().toString();
  expect(s).toBe(undefined);
});
