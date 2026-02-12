import { useParams, Navigate } from "react-router-dom";
import { useLayoutEffect } from "react";
import { getServiceBySlug } from "@/data/serviceData";
import ServiceLandingPage from "@/components/ServiceLandingPage";

const ServicePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceBySlug(slug) : undefined;

  // Force scroll to top before anything renders
  useLayoutEffect(() => {
    // Immediately scroll
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [slug]);

  if (!service) {
    return <Navigate to="/" replace />;
  }

  return <ServiceLandingPage key={slug} service={service} />;
};

export default ServicePage;
