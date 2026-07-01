"use client";

import { useEffect, useRef } from "react";
import { openApiSpec } from "@/lib/openapi";
import SwaggerUIBundle from "./swagger-ui-bundle";
import "swagger-ui-react/swagger-ui.css";

export default function DocsPage() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current || !SwaggerUIBundle) {
      return;
    }

    const swaggerInstance = SwaggerUIBundle({
      domNode: mountRef.current,
      spec: openApiSpec,
      deepLinking: true,
      docExpansion: "none",
      displayRequestDuration: true,
      persistAuthorization: true,
      withCredentials: true,
    });

    return () => {
      if (typeof swaggerInstance === "function") {
        swaggerInstance();
      } else if (
        swaggerInstance &&
        typeof (swaggerInstance as { unmount?: () => void }).unmount === "function"
      ) {
        (swaggerInstance as { unmount: () => void }).unmount();
      }

      if (mountRef.current) {
        mountRef.current.innerHTML = "";
      }
    };
  }, []);

  return <div ref={mountRef} />;
}
