import { expectType } from "tsd";
import { typedEnv } from "./typed-env";

// string
process.env["TEST"] = "abc";
expectType<string>(typedEnv("TEST").required().toString());
expectType<string | undefined>(typedEnv("TEST").optional().toString());

// number
process.env["TEST"] = "1";
expectType<number>(typedEnv("TEST").required().toInt());
expectType<number | undefined>(typedEnv("TEST").optional().toInt());
expectType<number>(typedEnv("TEST").required().optional().toInt());
expectType<number>(typedEnv("TEST").optional().required().toInt());

// boolean
process.env["TEST"] = "true";
expectType<boolean>(typedEnv("TEST").required().toBoolean());
expectType<boolean | undefined>(typedEnv("TEST").optional().toBoolean());
expectType<boolean | undefined>(typedEnv("TEST").toBoolean());
expectType<boolean>(typedEnv("TEST").required().optional().toBoolean());
expectType<boolean>(typedEnv("TEST").optional().required().toBoolean());

// default
expectType<string>(typedEnv("TEST").default("abc").toString());
expectType<string>(typedEnv("TEST").default("abc").optional().toString());
expectType<string>(typedEnv("TEST").default("abc").required().toString());
expectType<number>(typedEnv("TEST").default("1").toInt());
expectType<boolean>(typedEnv("TEST").default("true").toBoolean());
