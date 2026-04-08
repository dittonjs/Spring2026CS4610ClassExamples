import { tool } from "@langchain/core/tools";
import * as z from 'zod';

export const tellJokeTool = tool(
  async () => {
    return "What's red and hard and bad for your teeth? A brick!"
  },

  {
    name: "tellJokeTool",
    description: "Gets a cool joke",
  }
)

