import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/infrastructure/database/prisma";
import {
  CreateAboutSchema,
  UpdateAboutSchema,
} from "@/modules/about/about.schema";
import { withAuth } from "@/shared/http/with-auth";
import { withErrorHandler } from "@/shared/http/with-error-handler";

export const GET = withErrorHandler(
  withAuth(async () => {
    const about = await prisma.about.findFirst({
      select: {
        id: true,
        description: true,
      },
    });

    if (!about) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "ABOUT_NOT_FOUND",
            message: "About data not found",
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "About data retrieved successfully",
        data: about,
      },
      { status: 200 },
    );
  }),
);

export const POST = withErrorHandler(
  withAuth(async (req: Request) => {
    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_JSON",
            message: "Request body must be valid JSON",
          },
        },
        { status: 400 },
      );
    }

    const parsed = CreateAboutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid input data",
            fields: parsed.error.flatten().fieldErrors,
          },
        },
        { status: 400 },
      );
    }

    const existing = await prisma.about.findFirst();

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "ABOUT_ALREADY_EXISTS",
            message: "About data already exists. Please use update instead.",
          },
        },
        { status: 400 },
      );
    }

    const about = await prisma.about.create({
      data: {
        description: parsed.data.description,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "About created successfully",
        data: about,
      },
      { status: 201 },
    );
  }),
);

export const PUT = withErrorHandler(
  withAuth(async (req: Request) => {
    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_JSON",
            message: "Request body must be valid JSON",
          },
        },
        { status: 400 },
      );
    }

    const parsed = UpdateAboutSchema.safeParse(body);

    // 🔴 Validation error
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid input data",
            fields: parsed.error.flatten().fieldErrors,
          },
        },
        { status: 400 },
      );
    }

    const existing = await prisma.about.findFirst();

    const newDescription = parsed.data.description?.trim();

    // 🟢 If not exist → create (upsert-like behavior)
    if (!existing) {
      const created = await prisma.about.create({
        data: {
          description: newDescription!,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: "About created successfully",
          data: created,
        },
        { status: 201 },
      );
    }

    // 🔴 No changes
    if (!newDescription || newDescription === existing.description) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NO_CHANGES",
            message: "At least one change must be made",
          },
        },
        { status: 400 },
      );
    }

    // 🟢 Update
    const updated = await prisma.about.update({
      where: { id: existing.id },
      data: {
        description: newDescription,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "About updated successfully",
        data: updated,
      },
      { status: 200 },
    );
  }),
);

export const DELETE = withErrorHandler(
  withAuth(async () => {
    const existing = await prisma.about.findFirst();

    // 🔴 Not found
    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "ABOUT_NOT_FOUND",
            message: "About data not found",
          },
        },
        { status: 404 },
      );
    }

    await prisma.about.delete({
      where: { id: existing.id },
    });

    // 🟢 Success
    return NextResponse.json(
      {
        success: true,
        message: "About deleted successfully",
        data: null,
      },
      { status: 200 },
    );
  }),
);
