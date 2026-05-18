import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-admin-code',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const generateAccessCode = (restaurantName = '') => {
  const cleanPrefix =
    restaurantName
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, '')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.slice(0, 3))
      .join('-') || 'MENURIA'

  const randomPart = crypto.randomUUID().slice(0, 4).toUpperCase()

  return `${cleanPrefix}-2026-${randomPart}`
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  const adminCode = req.headers.get('x-admin-code')
  const expectedAdminCode = Deno.env.get('ADMIN_CODE')

  if (!expectedAdminCode || adminCode !== expectedAdminCode) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(
      JSON.stringify({ error: 'Missing Supabase server configuration' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

  try {
    const { leadId } = await req.json()

    if (!leadId) {
      return new Response(
        JSON.stringify({ error: 'Missing leadId' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const { data: lead, error: leadError } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single()

    if (leadError || !lead) {
      return new Response(
        JSON.stringify({ error: 'Lead not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (lead.client_id) {
      return new Response(
        JSON.stringify({ error: 'Lead already has onboarding' }),
        {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const accessCode = generateAccessCode(lead.restaurant_name)

    const { data: client, error: clientError } = await supabaseAdmin
      .from('clients')
      .insert({
        restaurant_name: lead.restaurant_name || 'Restaurante sin nombre',
        contact_name: lead.contact_name,
        email: lead.email || null,
        phone: lead.phone || null,
        access_code: accessCode,
        status: 'onboarding',
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (clientError) {
      return new Response(
        JSON.stringify({ error: clientError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const { error: updateLeadError } = await supabaseAdmin
      .from('leads')
      .update({
        status: 'accepted',
        client_id: client.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', leadId)

    if (updateLeadError) {
      return new Response(
        JSON.stringify({ error: updateLeadError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    await supabaseAdmin.from('lead_interactions').insert({
      lead_id: leadId,
      action_type: 'onboarding_created',
      note: `Onboarding creado con código ${accessCode}`,
    })

    return new Response(
      JSON.stringify({
        success: true,
        client,
        accessCode,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Unexpected error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})