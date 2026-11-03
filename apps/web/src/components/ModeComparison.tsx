import { Botanical } from "./Homepage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function ModeComparison() {
  return (
    <div className="mode-comparison">
      <Tabs defaultValue="editorial">
        <TabsList aria-label="Usage mode">
          <TabsTrigger value="editorial">Editorial</TabsTrigger>
          <TabsTrigger value="product">Product</TabsTrigger>
        </TabsList>
        <TabsContent value="editorial">
          <div className="editorial-demo">
            <div>
              <span className="context-capsule">Fieldnotes / Journal</span>
              <h3>Make room for what matters.</h3>
              <p>
                A collection of everyday observations, thoughtful objects, and
                places to pause.
              </p>
              <a className="text-link" href="/patterns/#editorial-hero">
                Explore the editorial pattern <span aria-hidden="true">↗</span>
              </a>
            </div>
            <Botanical />
          </div>
        </TabsContent>
        <TabsContent value="product">
          <div className="product-demo">
            <div className="section-head">
              <div>
                <p className="product-meta">Fieldnotes / Workspace</p>
                <h3>Studio overview</h3>
              </div>
              <span className="status">All changes saved</span>
            </div>
            <div
              className="table-scroll"
              role="region"
              tabIndex={0}
              aria-label="Synthetic studio projects table, scroll horizontally"
            >
              <table
                className="data-table"
                aria-label="Synthetic studio projects"
              >
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Progress</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Everyday objects</td>
                    <td>84%</td>
                    <td>
                      <span className="status">In review</span>
                    </td>
                  </tr>
                  <tr>
                    <td>A slower morning</td>
                    <td>56%</td>
                    <td>
                      <span className="status pending">In progress</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Notes from the studio</td>
                    <td>100%</td>
                    <td>
                      <span className="status">Complete</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="product-meta demo-note">
              Synthetic studio data. Everything stays in this demo.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
