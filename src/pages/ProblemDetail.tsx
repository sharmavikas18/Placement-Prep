import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Send, BookOpen, Code2, CheckCircle, Clock, Star, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Example {
  input: string;
  output: string;
  explanation?: string;
}

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  topic: string;
  solved: boolean;
  starred: boolean;
  description: string;
  examples: Example[];
  constraints: string[];
  starterCode: string;
}

// Mock problem data - in a real app, this would come from an API
const problemsData: Record<string, Problem> = {
  "1": {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Arrays",
    solved: true,
    starred: true,
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    starterCode: `function twoSum(nums, target) {
    // Write your code here
    
}`,
  },
  "2": {
    id: 2,
    title: "Reverse Linked List",
    difficulty: "Easy",
    topic: "Linked Lists",
    solved: true,
    starred: false,
    description: `Given the head of a singly linked list, reverse the list, and return the reversed list.`,
    examples: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
      },
    ],
    constraints: [
      "The number of nodes in the list is the range [0, 5000].",
      "-5000 <= Node.val <= 5000",
    ],
    starterCode: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
function reverseList(head) {
    // Write your code here
    
}`,
  },
  "3": {
    id: 3,
    title: "Binary Tree Inorder",
    difficulty: "Medium",
    topic: "Trees",
    solved: false,
    starred: true,
    description: `Given the root of a binary tree, return the inorder traversal of its nodes' values.`,
    examples: [
      {
        input: "root = [1,null,2,3]",
        output: "[1,3,2]",
      },
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 100].",
      "-100 <= Node.val <= 100",
    ],
    starterCode: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
function inorderTraversal(root) {
    // Write your code here
    
}`,
  },
  "4": {
    id: 4,
    title: "Longest Substring",
    difficulty: "Medium",
    topic: "Strings",
    solved: false,
    starred: false,
    description: `Given a string s, find the length of the longest substring without repeating characters.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc", with the length of 3.',
      },
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces.",
    ],
    starterCode: `function lengthOfLongestSubstring(s) {
    // Write your code here
    
}`,
  },
  "5": {
    id: 5,
    title: "Merge K Sorted Lists",
    difficulty: "Hard",
    topic: "Linked Lists",
    solved: false,
    starred: true,
    description: `You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.`,
    examples: [
      {
        input: "lists = [[1,4,5],[1,3,4],[2,6]]",
        output: "[1,1,2,3,4,4,5,6]",
        explanation: "The linked-lists are:\n[\n  1->4->5,\n  1->3->4,\n  2->6\n]\nmerging them into one sorted list:\n1->1->2->3->4->4->5->6",
      },
    ],
    constraints: [
      "k == lists.length",
      "0 <= k <= 10^4",
      "0 <= lists[i].length <= 500",
      "-10^4 <= lists[i][j] <= 10^4",
    ],
    starterCode: `function mergeKLists(lists) {
    // Write your code here
    
}`,
  },
  "6": {
    id: 6,
    title: "Coin Change",
    difficulty: "Medium",
    topic: "DP",
    solved: true,
    starred: false,
    description: `You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.

You may assume that you have an infinite number of each kind of coin.`,
    examples: [
      {
        input: "coins = [1,2,5], amount = 11",
        output: "3",
        explanation: "11 = 5 + 5 + 1",
      },
    ],
    constraints: [
      "1 <= coins.length <= 12",
      "1 <= coins[i] <= 2^31 - 1",
      "0 <= amount <= 10^4",
    ],
    starterCode: `function coinChange(coins, amount) {
    // Write your code here
    
}`,
  },
};

const difficultyColors = {
  Easy: "text-success bg-success/10",
  Medium: "text-warning bg-warning/10",
  Hard: "text-destructive bg-destructive/10",
};

const ProblemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const problem = problemsData[id || "1"];

  const [code, setCode] = useState(problem?.starterCode || "");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  if (!problem) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Problem Not Found</h2>
          <p className="text-muted-foreground mb-4">The problem you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/dsa")}>Back to Problems</Button>
        </div>
      </div>
    );
  }

  const handleRun = () => {
    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => {
      setOutput("Running test cases...\n\nTest Case 1: Passed ✓\nTest Case 2: Passed ✓\n\nAll test cases passed!");
      setIsRunning(false);
    }, 1500);
  };

  const handleSubmit = () => {
    setIsRunning(true);
    // Simulate code submission
    setTimeout(() => {
      setOutput("Submitting solution...\n\nTest Case 1: Passed ✓\nTest Case 2: Passed ✓\nTest Case 3: Passed ✓\n\n✅ Accepted! Your solution has been submitted successfully.");
      setIsRunning(false);
    }, 2000);
  };

  const handleReset = () => {
    setCode(problem.starterCode);
    setOutput("");
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dsa")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-foreground">{problem.title}</h1>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${difficultyColors[problem.difficulty as keyof typeof difficultyColors]}`}>
              {problem.difficulty}
            </span>
            {problem.solved && (
              <CheckCircle className="w-5 h-5 text-success" />
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Star className={`w-4 h-4 ${problem.starred ? "text-warning fill-warning" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* Problem Description */}
        <div className="overflow-y-auto border-r border-border/50 bg-muted/20">
          <div className="p-6 space-y-6">
            <Tabs defaultValue="description" className="w-full">
              <TabsList>
                <TabsTrigger value="description">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Description
                </TabsTrigger>
                <TabsTrigger value="editorial">Editorial</TabsTrigger>
                <TabsTrigger value="solutions">Solutions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="space-y-6 mt-4">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                    {problem.description}
                  </p>
                </div>

                {/* Examples */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Examples</h3>
                  <div className="space-y-4">
                    {problem.examples.map((example: Example, index: number) => (
                      <div key={index} className="glass rounded-lg p-4 space-y-2">
                        <p className="font-medium text-foreground">Example {index + 1}:</p>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <span className="font-medium">Input:</span>{" "}
                            <code className="px-2 py-0.5 bg-muted rounded text-xs">
                              {example.input}
                            </code>
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Output:</span>{" "}
                            <code className="px-2 py-0.5 bg-muted rounded text-xs">
                              {example.output}
                            </code>
                          </p>
                          {example.explanation && (
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Explanation:</span> {example.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Constraints */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Constraints</h3>
                  <ul className="space-y-2">
                    {problem.constraints.map((constraint: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <code className="flex-1">{constraint}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="editorial" className="mt-4">
                <div className="glass rounded-lg p-6">
                  <p className="text-muted-foreground">Editorial coming soon...</p>
                </div>
              </TabsContent>

              <TabsContent value="solutions" className="mt-4">
                <div className="glass rounded-lg p-6">
                  <p className="text-muted-foreground">Community solutions coming soon...</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Code Editor & Output */}
        <div className="flex flex-col overflow-hidden bg-background">
          {/* Editor Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-muted/30">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Code Editor</span>
              <span className="text-xs text-muted-foreground">(JavaScript)</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </Button>
          </div>

          {/* Code Editor */}
          <div className="flex-1 overflow-hidden">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full p-4 bg-slate-950 text-slate-100 font-mono text-sm resize-none focus:outline-none"
              spellCheck={false}
              placeholder="Write your code here..."
            />
          </div>

          {/* Output Panel */}
          {output && (
            <div className="border-t border-border/50 bg-muted/30 overflow-y-auto max-h-48">
              <div className="px-4 py-2 border-b border-border/50">
                <span className="text-sm font-medium text-foreground">Output</span>
              </div>
              <pre className="p-4 text-sm text-muted-foreground whitespace-pre-wrap font-mono">
                {output}
              </pre>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 px-4 py-3 border-t border-border/50 bg-background">
            <Button
              onClick={handleRun}
              disabled={isRunning}
              variant="outline"
              className="gap-2"
            >
              {isRunning ? (
                <Clock className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              Run Code
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isRunning}
              className="gap-2"
            >
              {isRunning ? (
                <Clock className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;
