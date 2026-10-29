
import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/prisma";
import {
  CreateContactSchema,
  UpdateContactSchema,
} from "@/modules/contact/contact.schema";
import { withAuth } from "@/shared/http/with-auth";
import { withErrorHandler } from "@/shared/http/with-error-handler";

export const GET = withErrorHandler(
  withAuth(async () => {
    const contact = await prisma.contact.findFirst();

    if (!contact) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "CONTACT_NOT_FOUND",
            message: "Contact data not found",
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Contact data retrieved successfully",
        data: contact,
      },
      { status: 200 },
    );
  }),
);

export const POST = withErrorHandler(
  withAuth(async (req: Request) => {
    const existing = await prisma.contact.findFirst({
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "CONTACT_ALREADY_EXISTS",
            message: "Contact data already exists. Please use update instead.",
          },
        },
        { status: 400 },
      );
    }

    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_JSON",
            message: "Invalid JSON request body",
          },
        },
        { status: 400 },
      );
    }

    const result = CreateContactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid input data",
            fields: result.error.flatten().fieldErrors,
          },
        },
        { status: 400 },
      );
    }

    const contact = await prisma.contact.create({
      data: result.data,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Contact created successfully",
        data: contact,
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
            message: "Invalid JSON request body",
          },
        },
        { status: 400 },
      );
    }

    const result = UpdateContactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid input data",
            fields: result.error.flatten().fieldErrors,
          },
        },
        { status: 400 },
      );
    }

    const existing = await prisma.contact.findFirst();

    // Create if Contact data does not exist yet.
    if (!existing) {
      const contact = await prisma.contact.create({
        data: result.data,
      });

      return NextResponse.json(
        {
          success: true,
          message: "Contact created successfully",
          data: contact,
        },
        { status: 201 },
      );
    }

    const changes = Object.entries(result.data).some(
      ([key, value]) =>
        existing[key as keyof typeof existing] !== value,
    );

    if (!changes) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NO_CHANGES",
            message: "At least one field must be changed",
          },
        },
        { status: 400 },
      );
    }

    const contact = await prisma.contact.update({
      where: { id: existing.id },
      data: result.data,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Contact updated successfully",
        data: contact,
      },
      { status: 200 },
    );
  }),
);

export const DELETE = withErrorHandler(
  withAuth(async () => {
    const existing = await prisma.contact.findFirst({
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "CONTACT_NOT_FOUND",
            message: "Contact data not found",
          },
        },
        { status: 404 },
      );
    }

    await prisma.contact.delete({
      where: { id: existing.id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Contact deleted successfully",
        data: null,
      },
      { status: 200 },
    );
  }),
);
