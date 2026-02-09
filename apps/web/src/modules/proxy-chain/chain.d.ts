import {  NextFetchEvent, NextRequest } from "next/server";
import { NextMiddlewareResult } from "next/dist/server/web/types";

export type CustomProxyChain = (
    request: NextRequest,
    event: NextFetchEvent,
    next: () => Promise<NextMiddlewareResult>
) => Promise<NextMiddlewareResult>;