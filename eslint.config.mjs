import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // 🚨 ERRORES QUE BLOQUEAN EL BUILD
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_" 
      }],
      "react-hooks/exhaustive-deps": "error",
      "react-hooks/rules-of-hooks": "error",
      
      // ⚠️ WARNINGS IMPORTANTES
      "no-console": "warn",
      "prefer-const": "error",
      "no-unused-vars": "off", // Desactivado porque usamos la versión de TypeScript
      
      // 🔧 MEJORES PRÁCTICAS
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-empty-function": "warn",
    }
  },
  {
    // Configuración para archivos específicos
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error"
    }
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;