import type { Meta, StoryObj } from "@storybook/react";
// import { fn } from "@storybook/test";
import { Button } from "./Button";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    children: {
      name: "Content",
    },
    intent: {
      name: "Style",
      control: "select",
      options: ["solid", "outline"],
      table: {
        type: {
          summary: "solid | outline",
        },
      },
    },
    size: {
      name: "Size",
      control: "select",
      options: ["small", "medium", "large"],
      table: {
        type: {
          summary: "small | medium | large",
        },
      },
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  // args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    children: "Button",
    intent: "solid",
    size: "medium",
  },
};

export const Secondary: Story = {
  args: {
    children: "Button",
    intent: "outline",
    size: "medium",
  },
};
