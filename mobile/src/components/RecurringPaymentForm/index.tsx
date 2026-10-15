import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import {
  FormProvider,
  useForm,
  useFormContext,
  type FieldErrors,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import ArrowRightIcon from "@/assets/icons/arrow-right.svg";
import { SCREEN_WIDTH_RATIO } from "@/constants/dimensions";
import { useTheme } from "@/contexts/ThemeContext";
import { useTypography } from "@/hooks/useTypography";
import {
  createRecurringPaymentSchema,
  type CreateRecurringPaymentFormData,
} from "@/schemas/recurring-payment";
import { Styles } from "@/styles/stylesheets";
import { FontWeights } from "@/styles/typography";
import type { FieldName } from "./fields";
import { ReviewStep } from "./ReviewStep";
import { SECTIONS } from "./sections";
import { StepIndicator } from "./StepIndicator";

type FormData = CreateRecurringPaymentFormData;

type LayoutProps = {
  onSubmit: (data: FormData) => void;
  isPending: boolean;
  errorMessage?: string | null;
  resetLabel: string;
};

type RecurringPaymentFormProps = LayoutProps & {
  defaultValues: FormData;
  /**
   * "wizard" walks through one section at a time (used when adding).
   * "sections" shows every section on one page (used when editing).
   */
  variant?: "wizard" | "sections";
};

export function RecurringPaymentForm({
  defaultValues,
  variant = "wizard",
  ...layoutProps
}: RecurringPaymentFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(createRecurringPaymentSchema),
    defaultValues,
  });
  const { subscribe, getFieldState, trigger } = form;

  // Errors from the wizard's "Next" check aren't re-validated on change until
  // the form is submitted, so re-check a field that has an error whenever it
  // changes; the error then clears as soon as the input is valid.
  useEffect(
    () =>
      subscribe({
        formState: { values: true },
        callback: ({ name }) => {
          const field = name as FieldName | undefined;
          if (field && getFieldState(field).error) trigger(field);
        },
      }),
    [subscribe, getFieldState, trigger],
  );

  return (
    <FormProvider {...form}>
      {variant === "wizard" ? (
        <WizardLayout {...layoutProps} />
      ) : (
        <SectionsLayout {...layoutProps} />
      )}
    </FormProvider>
  );
}

const REVIEW_STEP = SECTIONS.length;

/** One section per step, then a review step. */
function WizardLayout({
  onSubmit,
  isPending,
  errorMessage,
  resetLabel,
}: LayoutProps) {
  const FontSizes = useTypography();
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const { trigger, handleSubmit, reset } = useFormContext<FormData>();

  const [step, setStep] = useState(0);
  // Set when the user leaves the review step to fix a section, so "Next"
  // takes them straight back to review instead of through every step again.
  const [returnToReview, setReturnToReview] = useState(false);

  const isFirstStep = step === 0;
  const isReviewStep = step === REVIEW_STEP;
  const section = SECTIONS[step];

  const goToStep = (index: number) => {
    if (isReviewStep) setReturnToReview(true);
    setStep(index);
  };

  const goToNextStep = async () => {
    const isValid = await trigger(section.fields);
    if (!isValid) return;
    setStep(returnToReview ? REVIEW_STEP : step + 1);
    setReturnToReview(false);
  };

  // Steps are validated on "Next", so this is only a safety net: go back to
  // the first step that has an invalid field.
  const onInvalid = (errors: FieldErrors<FormData>) => {
    const invalidStep = SECTIONS.findIndex((s) =>
      s.fields.some((field) => field in errors),
    );
    if (invalidStep !== -1) goToStep(invalidStep);
  };

  const onReset = () => {
    reset();
    setStep(0);
    setReturnToReview(false);
  };

  const title = isReviewStep ? "Review" : section.title;
  const subtitle = isReviewStep
    ? "Check everything before saving."
    : section.subtitle;
  const nextLabel = returnToReview ? "Back to Review" : "Next";

  return (
    <ScrollView contentContainerStyle={{ width: width * 1, flexGrow: 1 }}>
      <View
        style={[
          Styles.flexColumn,
          {
            flex: 1,
            justifyContent: "flex-start",
            marginTop: height * 0.01,
            gap: height * 0.015,
          },
        ]}
      >
        <StepIndicator
          currentStep={step}
          stepCount={SECTIONS.length + 1}
          onStepPress={goToStep}
        />

        <View style={{ width: width * SCREEN_WIDTH_RATIO, gap: 4 }}>
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: FontSizes.large,
              fontWeight: FontWeights.bold,
            }}
          >
            {title}
          </Text>
          <Text
            style={{ color: colors.textSecondary, fontSize: FontSizes.small }}
          >
            {subtitle}
          </Text>
        </View>

        {isReviewStep ? (
          <ReviewStep onEditSection={goToStep} />
        ) : (
          <section.Content />
        )}

        {isReviewStep && <FormError message={errorMessage} />}

        {/* Pushes the buttons to the bottom on short steps. */}
        <View style={{ flex: 1 }} />

        <View
          style={[
            Styles.flexRow,
            {
              width: width * SCREEN_WIDTH_RATIO,
              gap: 12,
              marginTop: height * 0.02,
              marginBottom: height * 0.01,
            },
          ]}
        >
          <TouchableOpacity
            onPress={isFirstStep ? onReset : () => setStep(step - 1)}
            disabled={isPending}
            style={{
              flex: 1,
              paddingVertical: 15,
              backgroundColor: colors.backgroundMuted,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: colors.textSecondary,
                fontWeight: FontWeights.semibold,
              }}
            >
              {isFirstStep ? resetLabel : "Back"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={
              isReviewStep ? handleSubmit(onSubmit, onInvalid) : goToNextStep
            }
            disabled={isPending}
            style={[
              Styles.flexRow,
              {
                flex: 1,
                gap: 8,
                paddingVertical: 15,
                backgroundColor: colors.primary,
                borderRadius: 10,
              },
            ]}
          >
            {isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text style={{ color: "white", fontWeight: FontWeights.bold }}>
                  {isReviewStep ? "Save" : nextLabel}
                </Text>
                {!isReviewStep && (
                  <ArrowRightIcon color="white" width={18} height={18} />
                )}
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

/** Every section on one page, so any field is one scroll away. */
function SectionsLayout({
  onSubmit,
  isPending,
  errorMessage,
  resetLabel,
}: LayoutProps) {
  const FontSizes = useTypography();
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const { handleSubmit, reset } = useFormContext<FormData>();

  return (
    <ScrollView contentContainerStyle={{ width: width * 1 }}>
      <View
        style={[
          Styles.flexColumn,
          { marginTop: height * 0.01, gap: height * 0.015 },
        ]}
      >
        {SECTIONS.map(({ title, Content }, index) => (
          <View
            key={title}
            style={[Styles.flexColumn, { gap: height * 0.015 }]}
          >
            {/* Section heading, with a divider above all but the first. */}
            <View
              style={{
                width: width * SCREEN_WIDTH_RATIO,
                paddingTop: index === 0 ? 0 : 12,
                borderTopWidth: index === 0 ? 0 : 1,
                borderColor: colors.border,
              }}
            >
              <Text
                style={{
                  color: colors.textPrimary,
                  fontWeight: FontWeights.bold,
                  fontSize: FontSizes.medium,
                }}
              >
                {title}
              </Text>
            </View>
            <Content />
          </View>
        ))}

        <FormError message={errorMessage} />

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
          style={{
            marginTop: height * 0.03,
            width: width * SCREEN_WIDTH_RATIO,
            paddingVertical: 15,
            backgroundColor: colors.primary,
            borderRadius: 6,
            alignItems: "center",
          }}
        >
          {isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ color: "white", fontWeight: FontWeights.bold }}>
              Save
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => reset()}
          disabled={isPending}
          style={[
            Styles.flexRow,
            {
              width: width * SCREEN_WIDTH_RATIO,
              paddingVertical: 10,
              backgroundColor: "transparent",
              borderRadius: 6,
              borderWidth: 1,
              borderColor: colors.border,
              gap: 8,
            },
          ]}
        >
          <Text
            style={{
              color: colors.textSecondary,
              fontWeight: FontWeights.semibold,
            }}
          >
            {resetLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/** The server error shown above the submit button. */
function FormError({ message }: { message?: string | null }) {
  const FontSizes = useTypography();
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();

  if (!message) return null;

  return (
    <Text
      style={{
        color: colors.danger,
        fontSize: FontSizes.small,
        textAlign: "center",
        width: width * SCREEN_WIDTH_RATIO,
        marginTop: height * 0.015,
      }}
    >
      {message}
    </Text>
  );
}
