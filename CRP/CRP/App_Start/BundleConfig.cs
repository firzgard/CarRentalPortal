using System.Web;
using System.Web.Optimization;

namespace CRP
{
	public class BundleConfig
	{
		// For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
		public static void RegisterBundles(BundleCollection bundles)
		{
			bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
						"~/Scripts/modernizr-*"));

			bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
						"~/Scripts/jquery.validate*"));

			// Use the development version of Modernizr to develop with and learn from. Then, when you're
			// ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
			bundles.Add(new ScriptBundle("~/bundles/js").Include(
						"~/Scripts/jquery-{version}.js",
						"~/Scripts/bootstrap.js",
						"~/Scripts/respond.js",
						"~/Scripts/jquery.slimscroll.js",
						"~/Scripts/metisMenu.js",
						"~/Scripts/inspinia.js",
						"~/Scripts/page.min.js"));

			bundles.Add(new StyleBundle("~/bundles/css").Include(
					  "~/Content/bootstrap.css",
					  "~/Content/font-awesome.css",
					  "~/Content/animate.css"));

			bundles.Add(new StyleBundle("~/bundles/siteCss").Include(
					  "~/Content/style.css"));
		}
	}
}
