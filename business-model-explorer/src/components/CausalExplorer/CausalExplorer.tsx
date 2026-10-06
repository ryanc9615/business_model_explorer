import { useState } from "react";
import { causalTrees } from "../../data/causalModel";
import type { CausalNodeDefinition } from "../../types/causal";
import "./CausalExplorer.css";

export function CausalExplorer() {
  const [path, setPath] = useState<CausalNodeDefinition[]>([
    causalTrees[0],
  ]);

  const currentNode = path[path.length - 1];
  const currentRoot = path[0];

  function selectRoot(root: CausalNodeDefinition) {
    setPath([root]);
  }

  function drillInto(node: CausalNodeDefinition) {
    if (!node.children?.length) {
      return;
    }

    setPath((previous) => [...previous, node]);
  }

  function navigateTo(index: number) {
    setPath((previous) => previous.slice(0, index + 1));
  }

  return (
    <section
      className="causal-explorer"
      aria-labelledby="causal-explorer-heading"
    >
      <div className="causal-explorer__header">
        <div>
          <h2 id="causal-explorer-heading">
            What drives the business?
          </h2>

          <p>
            Explore how operating decisions flow through
            growth, profitability and cash.
          </p>
        </div>
      </div>

      <div
        className="causal-explorer__tabs"
        role="group"
        aria-label="Business outcome"
      >
        {causalTrees.map((tree) => {
          const isActive = currentRoot.id === tree.id;

          return (
            <button
              key={tree.id}
              type="button"
              className={`causal-explorer__tab ${
                isActive
                  ? "causal-explorer__tab--active"
                  : ""
              }`}
              aria-pressed={isActive}
              onClick={() => selectRoot(tree)}
            >
              {tree.label}
            </button>
          );
        })}
      </div>

      <nav
        className="causal-breadcrumbs"
        aria-label="Causal explorer navigation"
      >
        {path.map((node, index) => {
          const isCurrent = index === path.length - 1;

          return (
            <div
              key={`${node.id}-${index}`}
              className="causal-breadcrumbs__item"
            >
              {index > 0 && (
                <span
                  className="causal-breadcrumbs__separator"
                  aria-hidden="true"
                >
                  ›
                </span>
              )}

              {isCurrent ? (
                <span
                  className="causal-breadcrumbs__current"
                  aria-current="page"
                >
                  {node.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => navigateTo(index)}
                >
                  {node.label}
                </button>
              )}
            </div>
          );
        })}
      </nav>

      <div className="causal-focus">
        <div className="causal-focus__top">
          <div>
            {currentNode.kind && (
              <span
                className={`causal-badge causal-badge--${currentNode.kind}`}
              >
                {currentNode.kind}
              </span>
            )}

            <h3>{currentNode.label}</h3>
          </div>
        </div>

        {currentNode.formula && (
          <div className="causal-focus__formula">
            {currentNode.formula}
          </div>
        )}

        {currentNode.explanation && (
          <p className="causal-focus__explanation">
            {currentNode.explanation}
          </p>
        )}
      </div>

      {currentNode.children?.length ? (
        <div className="causal-drivers">
          <div className="causal-drivers__heading">
            Driven by
          </div>

          <div className="causal-drivers__list">
            {currentNode.children.map((child) => {
              const hasChildren = Boolean(
                child.children?.length
              );

              const content = (
                <>
                  <div className="causal-child__content">
                    <div className="causal-child__heading">
                      <span className="causal-child__label">
                        {child.label}
                      </span>

                      {child.kind && (
                        <span
                          className={`causal-badge causal-badge--${child.kind}`}
                        >
                          {child.kind}
                        </span>
                      )}
                    </div>

                    {child.formula && (
                      <div className="causal-child__formula">
                        {child.formula}
                      </div>
                    )}

                    {child.explanation && (
                      <div className="causal-child__explanation">
                        {child.explanation}
                      </div>
                    )}
                  </div>

                  {hasChildren && (
                    <span
                      className="causal-child__arrow"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  )}
                </>
              );

              if (hasChildren) {
                return (
                  <button
                    key={child.id}
                    type="button"
                    className="causal-child causal-child--clickable"
                    onClick={() => drillInto(child)}
                    aria-label={`Explore ${child.label}`}
                  >
                    {content}
                  </button>
                );
              }

              return (
                <div
                  key={child.id}
                  className="causal-child causal-child--leaf"
                >
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="causal-end">
          <span className="causal-end__label">
            Operating driver
          </span>

          <p>
            This is the end of the causal chain in the
            current model.
          </p>
        </div>
      )}
    </section>
  );
}