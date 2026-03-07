import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/prisma";
import { withAuth } from "@/shared/http/with-auth";
import { UpdateWorkExperienceSchema } from "@/shared/validation/workExperience";
import { withErrorHandler } from "@/shared/http/with-error-handler";

export const PATCH = withErrorHandler(
  withAuth(async (req: Request, context) => {
    const resolvedParams = await context.params;
    const id = resolvedParams?.id;

    if (!id || id.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_ID",
            message: "Invalid work experience ID",
          },
        },
        { status: 400 },
      );
    }

    const existing = await prisma.workExperience.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "WORK_EXPERIENCE_NOT_FOUND",
            message: "Work experience not found",
          },
        },
        { status: 404 },
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
            message: "Request body must be valid JSON",
          },
        },
        { status: 400 },
      );
    }

    const validation = UpdateWorkExperienceSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid input data",
            fields: validation.error.flatten().fieldErrors,
          },
        },
        { status: 400 },
      );
    }

    const { companyName, position, location, startDate, endDate, description } =
      validation.data;

    // 🔥 Merge with existing
    const finalCompanyName = companyName ?? existing.companyName;
    const finalPosition = position ?? existing.position;
    const finalLocation =
      location !== undefined ? (location ?? null) : existing.location;

    const finalStartDate = startDate ? new Date(startDate) : existing.startDate;

    const finalEndDate =
      endDate !== undefined
        ? endDate
          ? new Date(endDate)
          : null
        : existing.endDate;

    const finalIsPresent = finalEndDate === null;

    const finalDescription =
      description !== undefined ? (description ?? null) : existing.description;

    // 🔥 Final date safety check
    if (finalEndDate && finalEndDate < finalStartDate) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_DATE_RANGE",
            message: "End date cannot be before start date",
          },
        },
        { status: 400 },
      );
    }

    // 🔥 Change detection
    const isChanged =
      finalCompanyName !== existing.companyName ||
      finalPosition !== existing.position ||
      finalLocation !== existing.location ||
      finalStartDate.getTime() !== existing.startDate.getTime() ||
      (existing.endDate?.getTime() ?? null) !==
        (finalEndDate?.getTime() ?? null) ||
      (finalDescription ?? null) !== (existing.description ?? null) ||
      finalIsPresent !== existing.isPresent;

    if (!isChanged) {
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

    const updated = await prisma.workExperience.update({
      where: { id },
      data: {
        companyName: finalCompanyName,
        position: finalPosition,
        location: finalLocation, // ✅ field baru
        startDate: finalStartDate,
        endDate: finalEndDate,
        isPresent: finalIsPresent,
        description: finalDescription,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Work experience updated successfully",
        data: updated,
      },
      { status: 200 },
    );
  }),
);

export const DELETE = withErrorHandler(
  withAuth(async (req: Request, context) => {
    const resolvedParams = await context.params;
    const id = resolvedParams?.id;

    if (!id || id.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_ID",
            message: "Invalid work experience ID",
          },
        },
        { status: 400 },
      );
    }

    const existing = await prisma.workExperience.findUnique({
      where: { id },
      select: {
        id: true,
        companyName: true,
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "WORK_EXPERIENCE_NOT_FOUND",
            message: "Work experience not found",
          },
        },
        { status: 404 },
      );
    }

    await prisma.workExperience.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Work experience deleted successfully",
        data: existing,
      },
      { status: 200 },
    );
  }),
);
